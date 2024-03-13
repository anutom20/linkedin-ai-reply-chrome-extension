import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useRef, useState } from "react"

import { CountButton } from "~features/CountButton"
import Modal from "~features/Modal"
import { waitForElementToBeVisible } from "~utils/utils"

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  useEffect(() => {
    console.log("useEffect called!")
    let textarea

    const init = async () => {
      try {
        if (
          !window.location.href.includes("https://www.linkedin.com/messaging/")
        ) {
          return
        }

        textarea = await waitForElementToBeVisible(
          '.msg-form__contenteditable[role="textbox"]'
        )

        console.log("textareaH", textarea)

        const conversationsContainer = document.querySelector(
          "#main > div > div.scaffold-layout__list-detail-inner.scaffold-layout__list-detail-inner--grow > div.scaffold-layout__list.msg__list > div.relative.display-flex.justify-center.flex-column.overflow-hidden.msg-conversations-container--inbox-shortcuts > ul"
        )

        // to prevent textarea element being stale
        // e.g if we click on an sponsored message , then there is no fresh textarea element
        // so we remove the listeners and set textarea = null
        // next time if textarea is null , it queries a fresh text-area from the DOM
        // this prevents breaking of functionality in case a sponsored message with no text-area is clicked

        conversationsContainer.addEventListener(
          "click",
          async function (event) {
            console.log("click event captured")

            if (!textarea) {
              textarea = document.querySelector(
                '.msg-form__contenteditable[role="textbox"]'
              )

              textarea.addEventListener("focus", handleFocus)
              textarea.addEventListener("blur", handleBlur)
              return
            }

            const newTextArea = document.querySelector(
              '.msg-form__contenteditable[role="textbox"]'
            )

            if (!newTextArea) {
              textarea.removeEventListener("focus", handleFocus)
              textarea.removeEventListener("blur", handleBlur)
              textarea = null
              return
            }

            console.log(handleBlur, handleFocus)
          }
        )

        console.log("textarea", textarea)

        // adding focus and blur event listeners to the textarea element to account for
        // appearing and disappearing of the generate icon

        if (textarea) {
          textarea.addEventListener("focus", handleFocus)
          textarea.addEventListener("blur", handleBlur)
        }
      } catch (err: any) {
        console.log(err)
      }
    }

    init()

    let currentPage = location.href

    // polling to check if page url has changed , init will be called again to prevent stale element of textarea
    // checked online , but found no event as such is available for url path changes

    setInterval(() => {
      if (currentPage != location.href) {
        // page has changed, set new page as 'current'
        console.log("page url changed!")
        currentPage = location.href

        init()
      }
    }, 2000)

    const handleFocus = () => {
      console.log("inside handleFocus")
      const icon = document.createElement("div")
      icon.className = "ai-generate-icon"
      icon.style.position = "absolute"
      icon.style.right = "48px"
      icon.style.top = "60px"

      icon.style.cursor = "pointer"

      const img = document.createElement("img")
      img.src = chrome.runtime.getURL("assets/ai-icon.png")
      img.style.height = "40px"
      img.style.width = "40px"

      icon.appendChild(img)
      // Show the component when the icon button is clicked
      icon.addEventListener("click", () => {
        console.log("icon clicked")
        setModalOpen(true)
      })
      textarea.appendChild(icon)
    }

    const handleBlur = () => {
      console.log("inside handleBlur")
      const icon = document.querySelector(".ai-generate-icon")
      if (icon) {
        icon.remove()
      }
    }
  }, [])

  return (
    <React.Fragment>
      {/* <div className="z-50 flex fixed top-32 right-8">
        <CountButton />
      </div> */}
      <Modal open={modalOpen} setOpen={setModalOpen} />
    </React.Fragment>
  )
}

export default PlasmoOverlay
