// The MIT License (MIT)

// Copyright (c) 2021 

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const CHARACTER_VALUES: [number, string][] = [
    [200, "🫂"],
    [50, "💖"],
    [10, "✨"],
    [5, "🥺"],
    [1, ","],
    [0, "❤️"],
];
const SECTION_SEPERATOR = "👉👈";
const FINAL_TERMINATOR = new RegExp(`(${SECTION_SEPERATOR})?$`);

interface TextEncoderType {
    encode: (input?: string) => Uint8Array;
}

interface TextDecoderType {
    decode: (input?: Uint8Array) => string;
}

function textEncoder(): TextEncoderType {
    return new TextEncoder();
}

function textDecoder(): TextDecoderType {
    return new TextDecoder();
}

function encodeChar(charValue: number): string {
    if (charValue === 0) return "";
    let [val, currentCase]: [number, string] =
    CHARACTER_VALUES.find(([val]) => charValue >= val) || CHARACTER_VALUES[-1];
    return `${currentCase}${encodeChar(charValue - val)}`;
}

export function encode(value: string): string {
    return Array.from(textEncoder().encode(value))
    .map((v: number) => encodeChar(v) + SECTION_SEPERATOR)
    .join("");
}

export function decode(value: string): string {
    return textDecoder().decode(Uint8Array.from(
    value
        .trim()
        .replace(FINAL_TERMINATOR, "")
        .split(SECTION_SEPERATOR)
        .map((letters) => {
        return Array.from(letters)
            .map((character) => {
            let [value, emoji]: [number, string] =
                CHARACTER_VALUES.find(([_, em]) => em == character) ||
                CHARACTER_VALUES[-1];
            if (!emoji) {
                throw new TypeError(`Invalid bottom text: '${value}'`);
            }
            return value;
            })
            .reduce((p, c) => p + c);
        })
    ));
}
