"use client";

import Image from "next/image";
import iconv from "iconv-lite";
import { useState } from "react";
import bear1 from "public/images/bear1.png";

export default function Home() {
  const [input, setInput] = useState("ÄãºÃÎÒÊÇ¼ÒÀÖ");
  const [removeSpace, setRemoveSpace] = useState(true);

  const getHex = (lines: string[]) => {
    return lines.map((line, index) => {
      const lineHex = line.replace(/\s/g, ""); //todo: update when added convert white space option
      const hexArray = iconv
        .encode(lineHex, "utf-16be")
        .toString("hex")
        .match(/.{4}/g);

      const prefixed = hexArray?.map((hex, index) => {
        const actualHex = "\\u" + Buffer.from(hex, "hex").toString("hex");
        return actualHex;
      });
      // console.log(prefixed);
      const prefixedLine = !removeSpace
        ? prefixed?.join(" ")
        : prefixed?.join("");
      return prefixedLine;
    });
  };

  const convertGarbled = (garbled: string) => {
    // console.log("----------------------------------------");
    // console.log(`converting garbled text...`);

    // Split the garbled text into lines
    const lines = removeSpace
      ? garbled.replace(" ", "").split("\n")
      : garbled.split("\n");
    // console.log(`garbled lines: `);
    // console.log(lines);

    // Convert each line to UTF-16 representation
    const utf16Lines = lines.map((line) =>
      iconv.encode(line, "utf-16be").toString("hex")
    );

    // console.log(`encoded into utf-16be: `);
    // console.log(utf16Lines);

    // Remove leading zeros and combine UTF-16 pairs in each line
    const cp936PairHexLines = utf16Lines.map((line, index) => {
      const array = !removeSpace
        ? line.replace(/0020/g, "").replace(/00/g, "").match(/.{4}/g)
        : line.replace(/00/g, "").match(/.{4}/g);
      // console.log(`fixed line[${index}] (CP936): `);
      // console.log(array);
      return array?.join("") || "";
    });

    const cp936 = cp936PairHexLines.map(line => {
      const array = !removeSpace? line.match(/.{4}/g)?.join(' ') : line
      return array
    }).join('\n')
    // console.log(`fixed line compbined: `);
    // console.log(cp936PairHexLines);

    // Convert UTF-16 pairs to Buffer for each line
    const buffers = cp936PairHexLines.map((line) => Buffer.from(line, "hex"));

    // Decode each Buffer using CP936 encoding
    const decodedLines = buffers.map((buffer, index) => {
      const decoded = iconv.decode(buffer, "CP936");
      // console.log(`decoded line[${index}]: ${decoded}`);
      const decodedLine = !removeSpace ? decoded.split("").join(" ") : decoded;
      return decodedLine;
    });

    // Join the lines back with newline characters
    const result = decodedLines.join("\n");

    // Get the hex representation of the decoded text
    const decodedTextHex = getHex(decodedLines);
    const utf16 = decodedTextHex.join("\n");

    // console.log(`finished converting garbled text...`);
    // console.log("----------------------------------------");

    return { result, utf16, cp936 };
  };

  const { result, utf16, cp936 } = convertGarbled(input);
  // console.log(`final text: `);
  // console.log(result);
  // console.log(`final hex`);
  // console.log(utf16);
  // console.log("----------------------------------------");
  const formatted = input.split("\n").map((line, index) => {
    const newLine = removeSpace
    ? line.replace(/\s/g, "")
    : line.match(/.{2}/g)?.join(" ");
    return newLine;
  }).join('\n');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
      <div className="bear max-w-[60%] lg:max-w-[40%]">
        <Image src={bear1} alt={"bear"} />
      </div>
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
      <div className="relative flex place-items-center ">
        <div>
          <label
            htmlFor="formatted_value"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Formatted Text
          </label>
          <textarea
            inputMode="text"
            id="formatted_value"
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Formatted text"
            value={formatted}
            disabled
          />
        </div>

        <div className="w-4"></div>

        <div>
          <label
            htmlFor="cp_936_value"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            CP936
          </label>
          <textarea
            inputMode="text"
            id="cp_936_value"
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="CP936"
            value={cp936}
            disabled
          />
        </div>

        <div className="w-4"></div>

        <div>
          <label
            htmlFor="utf_16_value"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            UTF16
          </label>
          <textarea
            inputMode="text"
            id="utf_16_value"
            className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="UTF16"
            value={utf16}
            disabled
          />
        </div>
      </div>
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
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg ring-green-500 border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:ring-green-500 dark:border-green-500"
          placeholder="Fixed text"
          value={result}
          disabled
        />
      </div>
      <div className="mt-4 mb-8">Enjoy your day!</div>
      <div>
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
