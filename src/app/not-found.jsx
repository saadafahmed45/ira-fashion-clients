import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex  my-24 justify-center text-center">
      <div>
        <h2 className="text-4xl ">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/" className="text-red-700">
          Return Home
        </Link>
      </div>
    </div>
  );
}
