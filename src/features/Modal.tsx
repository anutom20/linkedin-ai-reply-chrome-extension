import type { Stringifier } from "postcss"
import React, { useState } from "react"
import { IoMdArrowDown, IoMdSend } from "react-icons/io"
import { IoCloseOutline } from "react-icons/io5"
import { TfiReload } from "react-icons/tfi"

interface Modal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface ConversationComponent {
  question: string
  reply: string
}

const dummyReply =
  "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."

const Modal: React.FC<Modal> = ({ open, setOpen }) => {
  const [prompt, setPrompt] = useState<string>("")
  const [conversationRecordedPrompt, setConversationRecordedPrompt] =
    useState<string>("")
  const [showConversation, setShowConversation] = useState<boolean>(false)

  const insertText = (text: string) => {
    const paraElement = document.querySelector(
      "div.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate > p"
    )
    paraElement.innerHTML = text
    const inputEvent = new Event("input", { bubbles: true })
    paraElement.dispatchEvent(inputEvent)
  }

  const resetModal = () => {
    setShowConversation(false)
    setPrompt("")
    setOpen(false)
  }
  return (
    <div
      id="ai-generate-modal"
      className={`modal fixed inset-0 bg-gray-900 bg-opacity-50 ${open ? "flex" : "hidden"} items-center justify-center`}>
      <div className="modal-content bg-white p-6 rounded-lg relative w-1/3">
        {showConversation && (
          <ConversationComponent
            question={conversationRecordedPrompt}
            reply={dummyReply}
          />
        )}
        <input
          type="text"
          className="py-3 px-4 mt-6 block w-full bg-white border border-gray-300 rounded-lg text-xl focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="Your Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <span
          id="closeModalBtn"
          className="close-btn absolute top-1 right-5  text-xl size-7 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setOpen(false)}>
          <IoCloseOutline size={24} />
        </span>
        <div className="flex justify-end mt-4">
          {showConversation ? (
            <div className="flex justify-end gap-3">
              <button
                className="flex gap-2 border border-[#666D80] text-white items-center justify-content rounded-lg py-2 px-6 text-lg"
                onClick={() => {
                  insertText(dummyReply)
                  resetModal()
                }}>
                <IoMdArrowDown size={24} color="#666D80" />
                <span className="text-[#666D80] text-xl">Insert</span>
              </button>
              <button className="flex gap-3 bg-blue-500 text-white items-center justify-content rounded-lg py-2 px-6 text-lg">
                <TfiReload size={16} />
                <span className="text-white text-2xl">Regenerate</span>
              </button>
            </div>
          ) : (
            <button
              className="flex gap-2 bg-blue-500 text-white items-center justify-content rounded-lg py-2 px-6 text-lg"
              onClick={() => {
                setShowConversation(true)
                setConversationRecordedPrompt(prompt)
                setPrompt("")
              }}>
              <IoMdSend size={24} />
              <span className="text-white text-2xl">Generate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const ConversationComponent: React.FC<ConversationComponent> = ({
  question,
  reply
}) => {
  return (
    <div className="mx-auto my-8 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-end ml-32 ">
          <div className="bg-[#DFE1E7] rounded-lg p-4 ">
            <p className="text-[#666D80] text-xl">{question}</p>
          </div>
        </div>
        <div className="flex justify-start mr-32">
          <div className="bg-[#DBEAFE] rounded-lg p-4">
            <p className="text-[#666D80] text-xl">{reply}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
