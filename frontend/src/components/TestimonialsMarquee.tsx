import { testimonials } from '../data/testimonials'

export const TestimonialsMarquee = () => (
  <div className="testimonial-marquee">
    {[...testimonials, ...testimonials].map((testimonial, index) => (
      <figure key={`${testimonial.name}-${index}`}>
        <blockquote>"{testimonial.quote}"</blockquote>
        <figcaption>
          {testimonial.name} - {testimonial.role}
        </figcaption>
      </figure>
    ))}
  </div>
)
