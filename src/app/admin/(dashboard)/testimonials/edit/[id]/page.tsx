import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/queries/testimonials";
import TestimonialForm from "../../TestimonialForm";

export const metadata = {
  title: "Edit Testimonial | Admin",
};

export default async function EditTestimonialPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const testimonial = await getTestimonialById(params.id);

  if (!testimonial) {
    notFound();
  }

  return <TestimonialForm testimonial={testimonial} />;
}
