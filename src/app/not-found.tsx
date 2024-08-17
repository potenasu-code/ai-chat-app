import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image alt="NotFound" fill src={"/not-found.svg"} />
      </div>
      <p className="text-muted-foreground text-sm text-center">
        ページが見つかりません
      </p>
      <Link href="/conversation">Conversationページに戻る</Link>
    </div>
  );
}
