"use client";

import Image from "next/image";
import iconv from "iconv-lite";
import { useState } from "react";
import bear1 from "public/images/bear1.png";

export default function Home() {
  const [input, setInput] = useState("ÄãºÃÎÒÊÇ¼ÒÀÖ");

  const convertGarbled = (garbled: string) => {
    // Convert the garbled characters to UTF-16 representation
    const utf16 = iconv.encode(garbled, "utf-16").toString("hex");
    console.log(`utf16: ${utf16}`);

    // Remove leading zeros and combine in pairs
    const utf16Pairs = utf16.replace(/00/g, "").match(/.{4}/g);
    utf16Pairs?.shift(); // Remove the first pair because it is always fffe
    console.log(`utf16Pairs: ${utf16Pairs}`);

    // // Convert UTF-16 pairs to Buffer
    const result = utf16Pairs
      ?.map((pair, index) => {
        const buffer = Buffer.from(pair, "hex");
        const decoded = iconv.decode(buffer, "CP936");
        console.log(`decoded ${index}: ${decoded}`);
        return decoded;
      })
      .join("");

    return result;
  };

  const result = convertGarbled(input);
  console.log(`actual result: ${result}`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <a href="https://github.com/kyaroru/character-fixer">Fix your garbled mandarin text</a>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a href="https://github.com/kyaroru">By @kyaroru</a>
        </div>
      </div>
      <div className="bear max-w-[60%] lg:max-w-[40%]">
        <Image src={bear1} alt={"bear"} />
      </div>
      <div className="relative flex place-items-center ">
        <div>
          <label
            htmlFor="original_value"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Garbled Text
          </label>
          <textarea
            inputMode="text"
            id="original_value"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your garbled text"
            defaultValue={input}
            onChange={(e) => {
              console.log(e.target.value);
              setInput(e.target.value);
            }}
          />
        </div>
        <div className="w-4"></div>
        <div>
          <label
            htmlFor="fixed_value"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Fixed Text
          </label>
          <textarea
            inputMode="text"
            id="fixed_value"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Fixed text"
            value={result}
            disabled
          />
        </div>
      </div>
      <div className="mt-4 mb-8">Enjoy your day!</div>
      <div>Credits goes to <a className="text-pink-400" href="https://superuser.com/questions/894999/how-can-i-find-out-the-encoding-of-this-corrupted-chinese-text-which-an-online">this amazing thread</a> for the explanation! </div>
    </main>
  );
}
