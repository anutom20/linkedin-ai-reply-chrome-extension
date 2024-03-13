export const waitForElementToBeVisible = async (selector) => {
  let target = document.querySelector(selector)
  if (target && target.offsetParent !== null) {
    return target
  }
  let element
  await new Promise((resolve) => {
    let observer = new MutationObserver(() => {
      let target = document.querySelector(selector)
      if (target && target.offsetParent !== null) {
        observer.disconnect()
        element = target
        resolve(element)
      }
    })
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
  })
  return element
}
