import DeletePosts from './deletePost.js'
import LLMContentCheck from '../gemini/contentCheck.js'

const MAX_LIMIT = 2

let queue = []
let temp = []
let processing = false
let started = false

function transferFromTempToQueue() {
  if (temp.length > 0) {
    // console.log("Filling up queue from temp...")
    // console.log("Temp -> " , temp)
    queue.push(...temp)
    // console.log("Queue - > " , queue)
    temp = []
  }
}

async function processQueue() {
  if (processing || queue.length < MAX_LIMIT) return
  processing = true

  const batch = queue.splice(0, MAX_LIMIT)
  // console.log("Current Batch : " , batch)
  let res = await LLMContentCheck(batch)

  while (!res || res.error) {
    await new Promise((r) => setTimeout(r, 2000))
    res = await LLMContentCheck(batch)
  }

  processing = false

  if (res.idsArray.length === 0) {
    transferFromTempToQueue()
    return
  }

  const delResponse = await DeletePosts({ idsArray: res.idsArray })
  if (!delResponse) {
    queue.unshift(...batch)
  }
  transferFromTempToQueue()
}

function startQueueProcessor() {
  if (started) return // this prevents this from running multiple times , kind of acting similar to useRef()
  started = true
  // console.log("Multiple starts - WRONG")
  setInterval(async () => {
    // console.log("Current Queue : " , queue)
    if (queue.length >= MAX_LIMIT && !processing) {
      await processQueue()
    }
  }, 1000)
}

export function initQueue() {
  startQueueProcessor()

  const addToQueue = (post) => {
    if (processing) {
      // console.log("Adding in Temp : " , post)
      temp.push(post)
    } else {
      // console.log("Adding in Queue : " , post)
      queue.push(post)
    }
  }

  return { addToQueue }
}
