// src/components/layout/footer.tsx

import { FaRecordVinyl } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-4 pb-6 border-t border-dashed lg:px-8 sm:px-6">
      <div className="flex flex-col py-10 md:flex-row md:justify-between md:items-start">
        <div className="flex flex-col items-start justify-start gap-y-5 md:w-1/4 md:mt-2.5">
          <div className="flex flex-row items-center gap-6">
            <Link href="/" className="flex items-center gap-x-2.5">
              <p className="text-xl font-bold">CTJR</p>
            </Link>
          </div>
          <p className="text-sm tracking-tight text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} CTJR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
