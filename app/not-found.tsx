import Link from "next/link";

// Shown for any address that doesn't exist.
export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-[720px] px-5 py-28 sm:px-8">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 font-serif text-[2.6rem] leading-tight tracking-[-0.02em]">This page isn’t in the handbook.</h1>
      <p className="mt-4 text-lg text-muted">The link may be old. Every topic is listed on the home page.</p>
      <Link href="/#topics" className="btn btn-primary mt-8">
        See all topics
      </Link>
    </main>
  );
}
