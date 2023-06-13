"use client";

import Image from "next/image";
import iconv from "iconv-lite";
import { useRef, useState } from "react";
import bear1 from "public/images/bear1.png";

export default function Home() {
  const [input, setInput] = useState("ÄãºÃÎÒÊÇ¼ÒÀÖ");
  const [removeSpace, setRemoveSpace] = useState(true);
  const originalTextRef = useRef(null);
  const formattedTextRef = useRef(null);
  const cp936TextRef = useRef(null);
  const utf16TextRef = useRef(null);
  const resultTextRef = useRef(null);

  const getUtfHex = (lines: string[]) => {
    return lines.map((line, index) => {
      const lineHex = line.replace(" ", ""); //todo: update when added convert white space option
      const hexArray = iconv
        .encode(lineHex, "utf-16be")
        .toString("hex")
        .match(/.{4}/g);
      const prefixed = hexArray?.map((hex, index) => {
        const actualHex = "\\u" + Buffer.from(hex, "hex").toString("hex");
        return actualHex;
      });
      const prefixedLine = !removeSpace
        ? prefixed?.join(" ")
        : prefixed?.join("");
      return prefixedLine;
    });
  };

  const getCP936Hex = (lines: string[]) => {
    return lines.map((line, index) => {
      const array = !removeSpace
        ? line.replace(/0020/g, "").replace(/00/g, "").match(/.{4}/g)
        : line.replace(/00/g, "").match(/.{4}/g);
      const hex = array?.map((line, index) => {
        const prefixed = "\\u" + Buffer.from(line, "hex").toString("hex");
        return prefixed;
      });
      return !removeSpace ? hex?.join(" ") : hex?.join("");
    });
  };

  const convertGarbled = (garbled: string) => {
    // Split the garbled text into lines
    const lines = garbled.split("\n");
    // Process each line individually
    const processedLines = lines.map((line: string) => {
      // Convert the line to UTF-16 representation
      const utf16 = iconv.encode(line, "utf-16be").toString("hex");

      // Remove leading zeros and combine UTF-16 pairs
      const utf16Pairs = utf16?.replace(/00/g, "")?.match(/.{4}/g)?.join("");

      // Convert UTF-16 pairs to Buffer
      const buffer = Buffer.from(utf16Pairs || "", "hex");

      // Decode the Buffer using CP936 encoding
      const decoded = iconv.decode(buffer, "CP936");

      // Return the decoded line
      return !removeSpace ? decoded.split("").join(" ") : decoded;
    });

    const utf16Lines = lines.map((line: string) => {
      // Convert the line to UTF-16 representation
      return iconv.encode(line, "utf-16be").toString("hex");
    });

    // Join the processed lines back with newline characters to form the final text
    const result = processedLines.join("\n");
    const cp936 = getCP936Hex(utf16Lines).join("\n");
    const utf16 = getUtfHex(processedLines).join("\n");
    return { result, utf16, cp936 };
  };

  const { result, utf16, cp936 } = convertGarbled(input);

  const formatted = input
    .split("\n")
    .map((line, index) => {
      const newLine = removeSpace
        ? line.replace(/\s/g, "")
        : line.match(/.{2}/g)?.join(" ");
      return newLine;
    })
    .join("\n");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <a href="https://github.com/kyaroru/character-fixer">
            Fix your garbled mandarin text
          </a>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a href="https://github.com/kyaroru">By @kyaroru</a>
        </div>
      </div>
      <div className="max-w-[60%] lg:max-w-[40%]">
        <Image priority src={bear1} alt={"bear"} />
      </div>

      <div className="w-[80%]">
        <div className="flex-col w-full original">
          <div className="flex justify-between">
            <label
              htmlFor="original_value"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Garbled Text
            </label>
            <div
              onClick={() => navigator.clipboard.writeText(input)}
              className="flex text-xs mt-[2px]"
            >
              ⎘
            </div>
          </div>
          <textarea
            ref={originalTextRef}
            inputMode="text"
            id="original_value"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-300 focus-visible:outline-0 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-red-300"
            placeholder="Enter your garbled text"
            defaultValue={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <div className="flex">
            <div className="flex">
              <input
                type="radio"
                radioGroup="space"
                id="remove_space"
                className="mr-2"
                checked={removeSpace}
                onChange={() => {
                  setRemoveSpace(true);
                }}
              />
              <label htmlFor="remove_space" className="block mt-2 mb-2 text-sm">
                Remove Space
              </label>
            </div>
            <div className="w-4"></div>
            <div className="flex">
              <input
                type="radio"
                radioGroup="space"
                id="add_space"
                className="mr-2"
                checked={!removeSpace}
                onChange={() => {
                  setRemoveSpace(false);
                }}
              />
              <label htmlFor="add_space" className="block mt-2 mb-2 text-sm">
                Add Space
              </label>
            </div>
          </div>
        </div>
        <div className="md:flex w-full md:space-x-4 processing">
          <div className="flex flex-1 flex-col">
            <div className="flex justify-between">
              <label
                htmlFor="formatted_value"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Formatted
              </label>
              <div
                onClick={() => navigator.clipboard.writeText(formatted)}
                className="flex text-xs mt-[2px]"
              >
                ⎘
              </div>
            </div>
            <textarea
              ref={formattedTextRef}
              inputMode="text"
              id="formatted_value"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Formatted text"
              value={formatted}
              disabled
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex justify-between">
              <label
                htmlFor="cp_936_value"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CP936
              </label>
              <div
                onClick={() => navigator.clipboard.writeText(cp936)}
                className="flex text-xs mt-[2px]"
              >
                ⎘
              </div>
            </div>

            <textarea
              ref={cp936TextRef}
              inputMode="text"
              id="cp_936_value"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="CP936"
              value={cp936}
              disabled
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex justify-between">
              <label
                htmlFor="utf_16_value"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                UTF16
              </label>
              <div
                onClick={() => navigator.clipboard.writeText(utf16)}
                className="flex text-xs mt-[2px]"
              >
                ⎘
              </div>
            </div>

            <textarea
              ref={utf16TextRef}
              inputMode="text"
              id="utf_16_value"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="UTF16"
              value={utf16}
              disabled
            />
          </div>
        </div>
        <div className="flex-col w-full result">
          <div className="flex justify-between">
            <label
              htmlFor="fixed_value"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Fixed Text
            </label>
            <div
              onClick={() => navigator.clipboard.writeText(result)}
              className="flex text-xs mt-[2px]"
            >
              ⎘
            </div>
          </div>
          <textarea
            ref={resultTextRef}
            inputMode="text"
            id="fixed_value"
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg ring-green-500 border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:ring-green-500 dark:border-green-500"
            placeholder="Fixed text"
            value={result}
            disabled
          />
        </div>
      </div>

      <div className="mt-4 mb-8">Enjoy your day!</div>
      <div className="text-center">
        Credits goes to{" "}
        <a
          className="text-pink-400"
          href="https://superuser.com/questions/894999/how-can-i-find-out-the-encoding-of-this-corrupted-chinese-text-which-an-online"
        >
          this amazing thread
        </a>{" "}
        for the explanation!{" "}
      </div>
    </main>
  );
}
