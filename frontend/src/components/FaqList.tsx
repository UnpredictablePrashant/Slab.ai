import { useState } from 'react'
import { faqs } from '../data/faqs'

export const FaqList = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => {
        const open = index === openIndex
        return (
          <article key={faq.question} className={`faq-item ${open ? 'open' : ''}`}>
            <button type="button" onClick={() => setOpenIndex(open ? null : index)}>
              <span>{faq.question}</span>
              <span>{open ? '-' : '+'}</span>
            </button>
            {open && <p>{faq.answer}</p>}
          </article>
        )
      })}
    </div>
  )
}
