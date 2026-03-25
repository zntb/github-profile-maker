import { Builder } from "@/components/builder";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <Builder />
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
