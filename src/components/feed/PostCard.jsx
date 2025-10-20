"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Share2 } from "lucide-react";

// --- Main PostCard Component ---
export default function PostCard({ post, currentUserId, currentUserAvatar }) {
  const {
    id,
    author,
    created_at,
    body,
    is_anonymous,
    reaction_counts,
    reaction,
    comments: initialComments,
  } = post;

  const supabase = createClient();

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsUserAuthenticated(!!session);
    };

    checkAuth();
    // No need to listen to supabase changes here, it's simple enough
  }, []);

  // State for managing comments
  const [comments, setComments] = useState(initialComments || []);

  const [reactedEmoji, setReactedEmoji] = useState(null);
  const [counts, setCounts] = useState(reaction_counts);

  const [copyStatus, setCopyStatus] = useState("Copy link");

  const reactionToEmojiMap = {
    Laugh: "😆",
    Clown: "🤡",
    Skull: "💀",
    Relatable: "🤝",
  };

  const findUserReaction = () => {
    if (!currentUserId || !reaction) return null;
    const userReaction = reaction.find((r) => r.user_id === currentUserId);
    return userReaction ? userReaction.reaction : null;
  };

  useEffect(() => {
    setReactedEmoji(findUserReaction());
    setCounts(reaction_counts);
    setComments(initialComments || []);
  }, [currentUserId, post]);

  const handleReactionClick = async (emojiName) => {
    if (!currentUserId) return;

    const originalReactedEmoji = reactedEmoji;
    const originalCounts = { ...counts };
    const newReactedEmoji = originalReactedEmoji === emojiName ? null : emojiName;
    const newCounts = { ...counts };

    if (originalReactedEmoji === emojiName) {
      newCounts[emojiName]--;
    } else if (originalReactedEmoji) {
      newCounts[originalReactedEmoji]--;
      newCounts[emojiName]++;
    } else {
      newCounts[emojiName]++;
    }

    setReactedEmoji(newReactedEmoji);
    setCounts(newCounts);

    try {
      const response = await axios.post("/api/post/react", {
        emojiName,
        postId: id,
      });
      if (response.status !== 201) {
        setReactedEmoji(originalReactedEmoji);
        setCounts(originalCounts);
      }
    } catch (error) {
      setReactedEmoji(originalReactedEmoji);
      setCounts(originalCounts);
      console.error("Error reacting to post:", error);
    }
  };

  // --- New function to handle optimistic UI update for new comments ---
  const handleCommentPosted = (newComment) => {
    // Add the new comment to the top of the list
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const handleShareClick = () => {
    // Construct the full URL for the post
    const postUrl = `${window.location.origin}/post/${id}`;

    // Use the modern navigator.clipboard API to copy the text
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        // Provide feedback to the user
        setCopyStatus("Copied!");
        // Reset the text after 2 seconds
        setTimeout(() => {
          setCopyStatus("Copy link");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setCopyStatus("Failed to copy");
      });
  };

  const username = author?.username || "AnonymousPanda";
  const avatar_url = author?.avatar_url || "/default_avatar.jpg";

  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <article className="bg-dark-secondary border border-dark-border rounded-lg p-5 md:p-6">
      {/* Post Header: Avatar and Author Info */}
      <div className="flex items-start gap-3">
        <Link href={is_anonymous ? "#" : `/profile/${author.id}`} className="flex-shrink-0">
          <div className="w-10 h-10 bg-dark-border rounded-full overflow-hidden">
            <Image
              src={is_anonymous ? "/anon_panda.jpg" : avatar_url}
              alt="User Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div>
            <Link
              href={is_anonymous ? "#" : `/profile/${author?.id}`}
              className="font-semibold text-light hover:underline"
            >
              {is_anonymous ? "Anonymous Panda" : username}
            </Link>
            <div className="text-light-secondary text-xs mt-0.5">{timeAgo}</div>
          </div>

          {/* Post Body: Content for larger screens */}
          <div className="hidden md:block mt-3 text-base text-light whitespace-pre-wrap break-words">
            {body}
          </div>
        </div>
      </div>

      {/* Post Body: Content for mobile */}
      <div className="md:hidden mt-3 text-base text-light whitespace-pre-wrap break-words">
        {body}
      </div>

      <div>
        <div className="flex gap-3 pt-4 flex-wrap items-center">
          {Object.entries(counts).map(([emojiName, count]) => {
            const emoji = reactionToEmojiMap[emojiName] || emojiName;
            const hasReacted = reactedEmoji === emojiName;
            return (
              <button
                key={emojiName}
                className={`flex items-center gap-1.5 text-light-secondary text-sm duration-200 transition-all ${
                  hasReacted ? "bg-white/10 text-light px-2 py-1 rounded-md" : "hover:text-light"
                }`}
                onClick={() => handleReactionClick(emojiName)}
              >
                <span className="text-xl leading-none">{emoji}</span>
                <span className="font-medium">{count}</span>
              </button>
            );
          })}

          <div className="flex-grow" />
          {/* This pushes the share button to the right */}
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 text-light-secondary text-sm hover:text-light transition-colors duration-200 group"
            title="Share post"
          >
            <Share2 className="w-4 h-4" />
            {/* Show a helpful tooltip on hover */}
            <span className="hidden group-hover:inline transition-opacity text-xs">
              {copyStatus}
            </span>
          </button>
        </div>

        <CommentSection
          postId={id}
          initialComments={comments}
          currentUserAvatar={currentUserAvatar}
          onCommentPosted={handleCommentPosted}
          isUserAuthenticated={isUserAuthenticated}
        />
      </div>
    </article>
  );
}

// --- Helper Component: Manages the list of comments and expand/collapse logic ---
function CommentSection({
  postId,
  initialComments,
  currentUserAvatar,
  onCommentPosted,
  isUserAuthenticated = false, // Default to false if not provided
}) {
  const [comments, setComments] = useState(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [moreCommentsAvailable, setMoreCommentsAvailable] = useState(true);

  // Update local state if the initial comments from props change
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const COMMENTS_TO_LOAD_AT_ONCE = 3;

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/post/comment/fetch", {
        params: {
          postId,
          offset: comments.length,
          limit: COMMENTS_TO_LOAD_AT_ONCE,
        },
      });

      if (response.data.comments.length < COMMENTS_TO_LOAD_AT_ONCE) {
        setMoreCommentsAvailable(false); // No more comments to load
      }
      if (response.data.comments.length === 0) {
        setMoreCommentsAvailable(false); // No more comments to load
        return;
      }

      // Append new comments to the existing list
      setComments((prevComments) => [...prevComments, ...response.data.comments]);
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-5 pt-4 border-t border-dark-border">
        <AddComment
          currentUserAvatar={currentUserAvatar}
          postId={postId}
          onCommentPosted={onCommentPosted} // Pass handler to AddComment
          isUserAuthenticated={isUserAuthenticated} // Pass authentication status
        />
      </div>
    );
  }

  return (
    <div className="mt-5 pt-4 border-t border-dark-border flex flex-col gap-3.5">
      <AddComment
        currentUserAvatar={currentUserAvatar}
        postId={postId}
        onCommentPosted={onCommentPosted} // Pass handler to AddComment
        isUserAuthenticated={isUserAuthenticated} // Pass authentication status
      />

      {/* Reverse the comments array for display to show newest first */}
      {comments
        .slice()
        .reverse()
        .map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}

      {/* Logic for showing "Load More" button */}
      <div className="flex gap-4">
        {moreCommentsAvailable && comments.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={isLoading || !moreCommentsAvailable}
            className="text-sm text-light-secondary hover:text-light transition-colors self-start disabled:cursor-wait"
          >
            {isLoading ? "Loading..." : "Load more comments"}
          </button>
        )}
      </div>
    </div>
  );
}

// --- Helper Component: A single comment ---
function Comment({ comment }) {
  const { author, avatar_url, body, created_at } = comment;
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <div className="flex items-start gap-3">
      <Link href={`/profile/${author.id}`} className="flex-shrink-0">
        <Image
          src={avatar_url || "/default_avatar.jpg"}
          alt={`${author.username}'s avatar`}
          width={32}
          height={32}
          className="rounded-full object-cover w-8 h-8"
        />
      </Link>
      <div className="flex-1 bg-dark px-3 py-2.5 rounded-lg border border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <Link
            href={`/profile/${author.id}`}
            className="font-semibold text-light text-sm hover:underline"
          >
            {author.username}
          </Link>
          <span className="text-light-secondary text-xs">{timeAgo}</span>
        </div>
        <p className="text-light whitespace-pre-wrap mt-1.5 text-sm break-words">{body}</p>
      </div>
    </div>
  );
}

// --- Helper Component: The "Add a comment" input field ---
function AddComment({ currentUserAvatar, postId, onCommentPosted, isUserAuthenticated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommentPosting, setIsCommentPosting] = useState(false);

  const handlePostComment = async () => {
    if (!isUserAuthenticated) return;
    if (!commentText.trim()) return;
    try {
      setIsCommentPosting(true);
      const response = await axios.post("/api/post/comment/create", {
        postId: postId,
        comment: commentText,
      });
      console.log(response.data);
      if (response.status === 201) {
        // Reset the form after posting
        onCommentPosted(response.data);
        setCommentText("");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsCommentPosting(false);
    }
  };

  if (!isEditing) {
    return (
      // The placeholder view
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsEditing(true)}>
        <div className="flex-shrink-0">
          <Image
            src={currentUserAvatar || "/default_avatar.jpg"}
            alt="Your Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover w-8 h-8"
          />
        </div>
        <div className="bg-dark w-full px-4 py-2.5 rounded-lg text-light-secondary text-sm border border-dark-border hover:border-light-secondary/50 transition-colors">
          Add a comment...
        </div>
      </div>
    );
  }

  // The active editing view
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <Image
          src={currentUserAvatar || "/default_avatar.jpg"}
          alt="Your Avatar"
          width={32}
          height={32}
          className="rounded-full object-cover w-8 h-8"
        />
      </div>
      <div className="flex-1">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2.5 text-light text-sm resize-y min-h-[70px] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          autoFocus
        />
        <div className="flex justify-end items-center gap-2 mt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm text-light-secondary hover:text-light transition-colors px-3 py-1.5"
          >
            Cancel
          </button>
          <button
            onClick={handlePostComment}
            disabled={!isUserAuthenticated || isCommentPosting || !commentText.trim()}
            className={`border-none px-4 py-1.5 rounded-md font-semibold text-sm text-white transition-colors ${
              isUserAuthenticated
                ? "bg-accent hover:bg-accent-hover cursor-pointer"
                : "bg-light-secondary/60 cursor-not-allowed"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isCommentPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
