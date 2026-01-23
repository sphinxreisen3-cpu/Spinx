#!/usr/bin/env node

/**
 * Tailwind to CSS Converter Utility
 *
 * This script helps convert Tailwind CSS classes to equivalent CSS properties.
 * It provides mappings for common Tailwind utilities and generates CSS modules.
 */

const fs = require('fs');
const path = require('path');

// Common Tailwind to CSS mappings
const tailwindMappings = {
  // Layout
  container:
    'width: 100%; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem;',
  'mx-auto': 'margin-left: auto; margin-right: auto;',
  flex: 'display: flex;',
  'inline-flex': 'display: inline-flex;',
  block: 'display: block;',
  'inline-block': 'display: inline-block;',
  inline: 'display: inline;',
  hidden: 'display: none;',
  relative: 'position: relative;',
  absolute: 'position: absolute;',
  fixed: 'position: fixed;',
  sticky: 'position: sticky;',

  // Spacing
  'm-1': 'margin: -0.25rem;',
  'm-2': 'margin: -0.5rem;',
  'm-3': 'margin: -0.75rem;',
  'm-4': 'margin: -1rem;',
  'mx-1': 'margin-left: -0.25rem; margin-right: -0.25rem;',
  'mx-2': 'margin-left: -0.5rem; margin-right: -0.5rem;',
  'mx-3': 'margin-left: -0.75rem; margin-right: -0.75rem;',
  'mx-4': 'margin-left: -1rem; margin-right: -1rem;',
  'my-1': 'margin-top: -0.25rem; margin-bottom: -0.25rem;',
  'my-2': 'margin-top: -0.5rem; margin-bottom: -0.5rem;',
  'my-3': 'margin-top: -0.75rem; margin-bottom: -0.75rem;',
  'my-4': 'margin-top: -1rem; margin-bottom: -1rem;',
  'm-0': 'margin: 0;',
  'm-0.5': 'margin: 0.125rem;',
  'm-1': 'margin: 0.25rem;',
  'm-1.5': 'margin: 0.375rem;',
  'm-2': 'margin: 0.5rem;',
  'm-2.5': 'margin: 0.625rem;',
  'm-3': 'margin: 0.75rem;',
  'm-3.5': 'margin: 0.875rem;',
  'm-4': 'margin: 1rem;',
  'm-5': 'margin: 1.25rem;',
  'm-6': 'margin: 1.5rem;',
  'm-8': 'margin: 2rem;',
  'm-10': 'margin: 2.5rem;',
  'm-12': 'margin: 3rem;',
  'm-16': 'margin: 4rem;',
  'm-20': 'margin: 5rem;',
  'm-24': 'margin: 6rem;',
  'm-32': 'margin: 8rem;',
  'm-40': 'margin: 10rem;',
  'm-48': 'margin: 12rem;',
  'm-56': 'margin: 14rem;',
  'm-64': 'margin: 16rem;',
  'm-px': 'margin: 1px;',
  'mx-0': 'margin-left: 0; margin-right: 0;',
  'mx-0.5': 'margin-left: 0.125rem; margin-right: 0.125rem;',
  'mx-1': 'margin-left: 0.25rem; margin-right: 0.25rem;',
  'mx-1.5': 'margin-left: 0.375rem; margin-right: 0.375rem;',
  'mx-2': 'margin-left: 0.5rem; margin-right: 0.5rem;',
  'mx-2.5': 'margin-left: 0.625rem; margin-right: 0.625rem;',
  'mx-3': 'margin-left: 0.75rem; margin-right: 0.75rem;',
  'mx-3.5': 'margin-left: 0.875rem; margin-right: 0.875rem;',
  'mx-4': 'margin-left: 1rem; margin-right: 1rem;',
  'mx-5': 'margin-left: 1.25rem; margin-right: 1.25rem;',
  'mx-6': 'margin-left: 1.5rem; margin-right: 1.5rem;',
  'mx-8': 'margin-left: 2rem; margin-right: 2rem;',
  'mx-10': 'margin-left: 2.5rem; margin-right: 2.5rem;',
  'mx-12': 'margin-left: 3rem; margin-right: 3rem;',
  'mx-16': 'margin-left: 4rem; margin-right: 4rem;',
  'mx-20': 'margin-left: 5rem; margin-right: 5rem;',
  'mx-24': 'margin-left: 6rem; margin-right: 6rem;',
  'mx-32': 'margin-left: 8rem; margin-right: 8rem;',
  'mx-40': 'margin-left: 10rem; margin-right: 10rem;',
  'mx-48': 'margin-left: 12rem; margin-right: 12rem;',
  'mx-56': 'margin-left: 14rem; margin-right: 14rem;',
  'mx-64': 'margin-left: 16rem; margin-right: 16rem;',
  'mx-auto': 'margin-left: auto; margin-right: auto;',
  'mx-px': 'margin-left: 1px; margin-right: 1px;',
  'my-0': 'margin-top: 0; margin-bottom: 0;',
  'my-0.5': 'margin-top: 0.125rem; margin-bottom: 0.125rem;',
  'my-1': 'margin-top: 0.25rem; margin-bottom: 0.25rem;',
  'my-1.5': 'margin-top: 0.375rem; margin-bottom: 0.375rem;',
  'my-2': 'margin-top: 0.5rem; margin-bottom: 0.5rem;',
  'my-2.5': 'margin-top: 0.625rem; margin-bottom: 0.625rem;',
  'my-3': 'margin-top: 0.75rem; margin-bottom: 0.75rem;',
  'my-3.5': 'margin-top: 0.875rem; margin-bottom: 0.875rem;',
  'my-4': 'margin-top: 1rem; margin-bottom: 1rem;',
  'my-5': 'margin-top: 1.25rem; margin-bottom: 1.25rem;',
  'my-6': 'margin-top: 1.5rem; margin-bottom: 1.5rem;',
  'my-8': 'margin-top: 2rem; margin-bottom: 2rem;',
  'my-10': 'margin-top: 2.5rem; margin-bottom: 2.5rem;',
  'my-12': 'margin-top: 3rem; margin-bottom: 3rem;',
  'my-16': 'margin-top: 4rem; margin-bottom: 4rem;',
  'my-20': 'margin-top: 5rem; margin-bottom: 5rem;',
  'my-24': 'margin-top: 6rem; margin-bottom: 6rem;',
  'my-32': 'margin-top: 8rem; margin-bottom: 8rem;',
  'my-40': 'margin-top: 10rem; margin-bottom: 10rem;',
  'my-48': 'margin-top: 12rem; margin-bottom: 12rem;',
  'my-56': 'margin-top: 14rem; margin-bottom: 14rem;',
  'my-64': 'margin-top: 16rem; margin-bottom: 16rem;',
  'my-auto': 'margin-top: auto; margin-bottom: auto;',
  'my-px': 'margin-top: 1px; margin-bottom: 1px;',
  'mt-0': 'margin-top: 0;',
  'mt-0.5': 'margin-top: 0.125rem;',
  'mt-1': 'margin-top: 0.25rem;',
  'mt-1.5': 'margin-top: 0.375rem;',
  'mt-2': 'margin-top: 0.5rem;',
  'mt-2.5': 'margin-top: 0.625rem;',
  'mt-3': 'margin-top: 0.75rem;',
  'mt-3.5': 'margin-top: 0.875rem;',
  'mt-4': 'margin-top: 1rem;',
  'mt-5': 'margin-top: 1.25rem;',
  'mt-6': 'margin-top: 1.5rem;',
  'mt-8': 'margin-top: 2rem;',
  'mt-10': 'margin-top: 2.5rem;',
  'mt-12': 'margin-top: 3rem;',
  'mt-16': 'margin-top: 4rem;',
  'mt-20': 'margin-top: 5rem;',
  'mt-24': 'margin-top: 6rem;',
  'mt-32': 'margin-top: 8rem;',
  'mt-40': 'margin-top: 10rem;',
  'mt-48': 'margin-top: 12rem;',
  'mt-56': 'margin-top: 14rem;',
  'mt-64': 'margin-top: 16rem;',
  'mt-auto': 'margin-top: auto;',
  'mt-px': 'margin-top: 1px;',
  'mr-0': 'margin-right: 0;',
  'mr-0.5': 'margin-right: 0.125rem;',
  'mr-1': 'margin-right: 0.25rem;',
  'mr-1.5': 'margin-right: 0.375rem;',
  'mr-2': 'margin-right: 0.5rem;',
  'mr-2.5': 'margin-right: 0.625rem;',
  'mr-3': 'margin-right: 0.75rem;',
  'mr-3.5': 'margin-right: 0.875rem;',
  'mr-4': 'margin-right: 1rem;',
  'mr-5': 'margin-right: 1.25rem;',
  'mr-6': 'margin-right: 1.5rem;',
  'mr-8': 'margin-right: 2rem;',
  'mr-10': 'margin-right: 2.5rem;',
  'mr-12': 'margin-right: 3rem;',
  'mr-16': 'margin-right: 4rem;',
  'mr-20': 'margin-right: 5rem;',
  'mr-24': 'margin-right: 6rem;',
  'mr-32': 'margin-right: 8rem;',
  'mr-40': 'margin-right: 10rem;',
  'mr-48': 'margin-right: 12rem;',
  'mr-56': 'margin-right: 14rem;',
  'mr-64': 'margin-right: 16rem;',
  'mr-auto': 'margin-right: auto;',
  'mr-px': 'margin-right: 1px;',
  'mb-0': 'margin-bottom: 0;',
  'mb-0.5': 'margin-bottom: 0.125rem;',
  'mb-1': 'margin-bottom: 0.25rem;',
  'mb-1.5': 'margin-bottom: 0.375rem;',
  'mb-2': 'margin-bottom: 0.5rem;',
  'mb-2.5': 'margin-bottom: 0.625rem;',
  'mb-3': 'margin-bottom: 0.75rem;',
  'mb-3.5': 'margin-bottom: 0.875rem;',
  'mb-4': 'margin-bottom: 1rem;',
  'mb-5': 'margin-bottom: 1.25rem;',
  'mb-6': 'margin-bottom: 1.5rem;',
  'mb-8': 'margin-bottom: 2rem;',
  'mb-10': 'margin-bottom: 2.5rem;',
  'mb-12': 'margin-bottom: 3rem;',
  'mb-16': 'margin-bottom: 4rem;',
  'mb-20': 'margin-bottom: 5rem;',
  'mb-24': 'margin-bottom: 6rem;',
  'mb-32': 'margin-bottom: 8rem;',
  'mb-40': 'margin-bottom: 10rem;',
  'mb-48': 'margin-bottom: 12rem;',
  'mb-56': 'margin-bottom: 14rem;',
  'mb-64': 'margin-bottom: 16rem;',
  'mb-auto': 'margin-bottom: auto;',
  'mb-px': 'margin-bottom: 1px;',
  'ml-0': 'margin-left: 0;',
  'ml-0.5': 'margin-left: 0.125rem;',
  'ml-1': 'margin-left: 0.25rem;',
  'ml-1.5': 'margin-left: 0.375rem;',
  'ml-2': 'margin-left: 0.5rem;',
  'ml-2.5': 'margin-left: 0.625rem;',
  'ml-3': 'margin-left: 0.75rem;',
  'ml-3.5': 'margin-left: 0.875rem;',
  'ml-4': 'margin-left: 1rem;',
  'ml-5': 'margin-left: 1.25rem;',
  'ml-6': 'margin-left: 1.5rem;',
  'ml-8': 'margin-left: 2rem;',
  'ml-10': 'margin-left: 2.5rem;',
  'ml-12': 'margin-left: 3rem;',
  'ml-16': 'margin-left: 4rem;',
  'ml-20': 'margin-left: 5rem;',
  'ml-24': 'margin-left: 6rem;',
  'ml-32': 'margin-left: 8rem;',
  'ml-40': 'margin-left: 10rem;',
  'ml-48': 'margin-left: 12rem;',
  'ml-56': 'margin-left: 14rem;',
  'ml-64': 'margin-left: 16rem;',
  'ml-auto': 'margin-left: auto;',
  'ml-px': 'margin-left: 1px;',

  // Padding
  'p-0': 'padding: 0;',
  'p-0.5': 'padding: 0.125rem;',
  'p-1': 'padding: 0.25rem;',
  'p-1.5': 'padding: 0.375rem;',
  'p-2': 'padding: 0.5rem;',
  'p-2.5': 'padding: 0.625rem;',
  'p-3': 'padding: 0.75rem;',
  'p-3.5': 'padding: 0.875rem;',
  'p-4': 'padding: 1rem;',
  'p-5': 'padding: 1.25rem;',
  'p-6': 'padding: 1.5rem;',
  'p-8': 'padding: 2rem;',
  'p-10': 'padding: 2.5rem;',
  'p-12': 'padding: 3rem;',
  'p-16': 'padding: 4rem;',
  'p-20': 'padding: 5rem;',
  'p-24': 'padding: 6rem;',
  'p-32': 'padding: 8rem;',
  'p-40': 'padding: 10rem;',
  'p-48': 'padding: 12rem;',
  'p-56': 'padding: 14rem;',
  'p-64': 'padding: 16rem;',
  'p-px': 'padding: 1px;',
  'px-0': 'padding-left: 0; padding-right: 0;',
  'px-0.5': 'padding-left: 0.125rem; padding-right: 0.125rem;',
  'px-1': 'padding-left: 0.25rem; padding-right: 0.25rem;',
  'px-1.5': 'padding-left: 0.375rem; padding-right: 0.375rem;',
  'px-2': 'padding-left: 0.5rem; padding-right: 0.5rem;',
  'px-2.5': 'padding-left: 0.625rem; padding-right: 0.625rem;',
  'px-3': 'padding-left: 0.75rem; padding-right: 0.75rem;',
  'px-3.5': 'padding-left: 0.875rem; padding-right: 0.875rem;',
  'px-4': 'padding-left: 1rem; padding-right: 1rem;',
  'px-5': 'padding-left: 1.25rem; padding-right: 1.25rem;',
  'px-6': 'padding-left: 1.5rem; padding-right: 1.5rem;',
  'px-8': 'padding-left: 2rem; padding-right: 2rem;',
  'px-10': 'padding-left: 2.5rem; padding-right: 2.5rem;',
  'px-12': 'padding-left: 3rem; padding-right: 3rem;',
  'px-16': 'padding-left: 4rem; padding-right: 4rem;',
  'px-20': 'padding-left: 5rem; padding-right: 5rem;',
  'px-24': 'padding-left: 6rem; padding-right: 6rem;',
  'px-32': 'padding-left: 8rem; padding-right: 8rem;',
  'px-40': 'padding-left: 10rem; padding-right: 10rem;',
  'px-48': 'padding-left: 12rem; padding-right: 12rem;',
  'px-56': 'padding-left: 14rem; padding-right: 14rem;',
  'px-64': 'padding-left: 16rem; padding-right: 16rem;',
  'px-px': 'padding-left: 1px; padding-right: 1px;',
  'py-0': 'padding-top: 0; padding-bottom: 0;',
  'py-0.5': 'padding-top: 0.125rem; padding-bottom: 0.125rem;',
  'py-1': 'padding-top: 0.25rem; padding-bottom: 0.25rem;',
  'py-1.5': 'padding-top: 0.375rem; padding-bottom: 0.375rem;',
  'py-2': 'padding-top: 0.5rem; padding-bottom: 0.5rem;',
  'py-2.5': 'padding-top: 0.625rem; padding-bottom: 0.625rem;',
  'py-3': 'padding-top: 0.75rem; padding-bottom: 0.75rem;',
  'py-3.5': 'padding-top: 0.875rem; padding-bottom: 0.875rem;',
  'py-4': 'padding-top: 1rem; padding-bottom: 1rem;',
  'py-5': 'padding-top: 1.25rem; padding-bottom: 1.25rem;',
  'py-6': 'padding-top: 1.5rem; padding-bottom: 1.5rem;',
  'py-8': 'padding-top: 2rem; padding-bottom: 2rem;',
  'py-10': 'padding-top: 2.5rem; padding-bottom: 2.5rem;',
  'py-12': 'padding-top: 3rem; padding-bottom: 3rem;',
  'py-16': 'padding-top: 4rem; padding-bottom: 4rem;',
  'py-20': 'padding-top: 5rem; padding-bottom: 5rem;',
  'py-24': 'padding-top: 6rem; padding-bottom: 6rem;',
  'py-32': 'padding-top: 8rem; padding-bottom: 8rem;',
  'py-40': 'padding-top: 10rem; padding-bottom: 10rem;',
  'py-48': 'padding-top: 12rem; padding-bottom: 12rem;',
  'py-56': 'padding-top: 14rem; padding-bottom: 14rem;',
  'py-64': 'padding-top: 16rem; padding-bottom: 16rem;',
  'py-px': 'padding-top: 1px; padding-bottom: 1px;',
  'pt-0': 'padding-top: 0;',
  'pt-0.5': 'padding-top: 0.125rem;',
  'pt-1': 'padding-top: 0.25rem;',
  'pt-1.5': 'padding-top: 0.375rem;',
  'pt-2': 'padding-top: 0.5rem;',
  'pt-2.5': 'padding-top: 0.625rem;',
  'pt-3': 'padding-top: 0.75rem;',
  'pt-3.5': 'padding-top: 0.875rem;',
  'pt-4': 'padding-top: 1rem;',
  'pt-5': 'padding-top: 1.25rem;',
  'pt-6': 'padding-top: 1.5rem;',
  'pt-8': 'padding-top: 2rem;',
  'pt-10': 'padding-top: 2.5rem;',
  'pt-12': 'padding-top: 3rem;',
  'pt-16': 'padding-top: 4rem;',
  'pt-20': 'padding-top: 5rem;',
  'pt-24': 'padding-top: 6rem;',
  'pt-32': 'padding-top: 8rem;',
  'pt-40': 'padding-top: 10rem;',
  'pt-48': 'padding-top: 12rem;',
  'pt-56': 'padding-top: 14rem;',
  'pt-64': 'padding-top: 16rem;',
  'pt-px': 'padding-top: 1px;',
  'pr-0': 'padding-right: 0;',
  'pr-0.5': 'padding-right: 0.125rem;',
  'pr-1': 'padding-right: 0.25rem;',
  'pr-1.5': 'padding-right: 0.375rem;',
  'pr-2': 'padding-right: 0.5rem;',
  'pr-2.5': 'padding-right: 0.625rem;',
  'pr-3': 'padding-right: 0.75rem;',
  'pr-3.5': 'padding-right: 0.875rem;',
  'pr-4': 'padding-right: 1rem;',
  'pr-5': 'padding-right: 1.25rem;',
  'pr-6': 'padding-right: 1.5rem;',
  'pr-8': 'padding-right: 2rem;',
  'pr-10': 'padding-right: 2.5rem;',
  'pr-12': 'padding-right: 3rem;',
  'pr-16': 'padding-right: 4rem;',
  'pr-20': 'padding-right: 5rem;',
  'pr-24': 'padding-right: 6rem;',
  'pr-32': 'padding-right: 8rem;',
  'pr-40': 'padding-right: 10rem;',
  'pr-48': 'padding-right: 12rem;',
  'pr-56': 'padding-right: 14rem;',
  'pr-64': 'padding-right: 16rem;',
  'pr-px': 'padding-right: 1px;',
  'pb-0': 'padding-bottom: 0;',
  'pb-0.5': 'padding-bottom: 0.125rem;',
  'pb-1': 'padding-bottom: 0.25rem;',
  'pb-1.5': 'padding-bottom: 0.375rem;',
  'pb-2': 'padding-bottom: 0.5rem;',
  'pb-2.5': 'padding-bottom: 0.625rem;',
  'pb-3': 'padding-bottom: 0.75rem;',
  'pb-3.5': 'padding-bottom: 0.875rem;',
  'pb-4': 'padding-bottom: 1rem;',
  'pb-5': 'padding-bottom: 1.25rem;',
  'pb-6': 'padding-bottom: 1.5rem;',
  'pb-8': 'padding-bottom: 2rem;',
  'pb-10': 'padding-bottom: 2.5rem;',
  'pb-12': 'padding-bottom: 3rem;',
  'pb-16': 'padding-bottom: 4rem;',
  'pb-20': 'padding-bottom: 5rem;',
  'pb-24': 'padding-bottom: 6rem;',
  'pb-32': 'padding-bottom: 8rem;',
  'pb-40': 'padding-bottom: 10rem;',
  'pb-48': 'padding-bottom: 12rem;',
  'pb-56': 'padding-bottom: 14rem;',
  'pb-64': 'padding-bottom: 16rem;',
  'pb-px': 'padding-bottom: 1px;',
  'pl-0': 'padding-left: 0;',
  'pl-0.5': 'padding-left: 0.125rem;',
  'pl-1': 'padding-left: 0.25rem;',
  'pl-1.5': 'padding-left: 0.375rem;',
  'pl-2': 'padding-left: 0.5rem;',
  'pl-2.5': 'padding-left: 0.625rem;',
  'pl-3': 'padding-left: 0.75rem;',
  'pl-3.5': 'padding-left: 0.875rem;',
  'pl-4': 'padding-left: 1rem;',
  'pl-5': 'padding-left: 1.25rem;',
  'pl-6': 'padding-left: 1.5rem;',
  'pl-8': 'padding-left: 2rem;',
  'pl-10': 'padding-left: 2.5rem;',
  'pl-12': 'padding-left: 3rem;',
  'pl-16': 'padding-left: 4rem;',
  'pl-20': 'padding-left: 5rem;',
  'pl-24': 'padding-left: 6rem;',
  'pl-32': 'padding-left: 8rem;',
  'pl-40': 'padding-left: 10rem;',
  'pl-48': 'padding-left: 12rem;',
  'pl-56': 'padding-left: 14rem;',
  'pl-64': 'padding-left: 16rem;',
  'pl-px': 'padding-left: 1px;',

  // Colors (basic)
  'text-white': 'color: rgb(255, 255, 255);',
  'text-black': 'color: rgb(0, 0, 0);',
  'text-gray-50': 'color: rgb(249, 250, 251);',
  'text-gray-100': 'color: rgb(243, 244, 246);',
  'text-gray-200': 'color: rgb(229, 231, 235);',
  'text-gray-300': 'color: rgb(209, 213, 219);',
  'text-gray-400': 'color: rgb(156, 163, 175);',
  'text-gray-500': 'color: rgb(107, 114, 128);',
  'text-gray-600': 'color: rgb(75, 85, 99);',
  'text-gray-700': 'color: rgb(55, 65, 81);',
  'text-gray-800': 'color: rgb(31, 41, 55);',
  'text-gray-900': 'color: rgb(17, 24, 39);',
  'bg-white': 'background-color: rgb(255, 255, 255);',
  'bg-black': 'background-color: rgb(0, 0, 0);',
  'bg-gray-50': 'background-color: rgb(249, 250, 251);',
  'bg-gray-100': 'background-color: rgb(243, 244, 246);',
  'bg-gray-200': 'background-color: rgb(229, 231, 235);',
  'bg-gray-300': 'background-color: rgb(209, 213, 219);',
  'bg-gray-400': 'background-color: rgb(156, 163, 175);',
  'bg-gray-500': 'background-color: rgb(107, 114, 128);',
  'bg-gray-600': 'background-color: rgb(75, 85, 99);',
  'bg-gray-700': 'background-color: rgb(55, 65, 81);',
  'bg-gray-800': 'background-color: rgb(31, 41, 55);',
  'bg-gray-900': 'background-color: rgb(17, 24, 39);',

  // Typography
  'text-xs': 'font-size: 0.75rem; line-height: 1rem;',
  'text-sm': 'font-size: 0.875rem; line-height: 1.25rem;',
  'text-base': 'font-size: 1rem; line-height: 1.5rem;',
  'text-lg': 'font-size: 1.125rem; line-height: 1.75rem;',
  'text-xl': 'font-size: 1.25rem; line-height: 1.75rem;',
  'text-2xl': 'font-size: 1.5rem; line-height: 2rem;',
  'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem;',
  'text-4xl': 'font-size: 2.25rem; line-height: 2.5rem;',
  'text-5xl': 'font-size: 3rem; line-height: 1;',
  'text-6xl': 'font-size: 3.75rem; line-height: 1;',
  'text-7xl': 'font-size: 4.5rem; line-height: 1;',
  'text-8xl': 'font-size: 6rem; line-height: 1;',
  'text-9xl': 'font-size: 8rem; line-height: 1;',
  'font-thin': 'font-weight: 100;',
  'font-extralight': 'font-weight: 200;',
  'font-light': 'font-weight: 300;',
  'font-normal': 'font-weight: 400;',
  'font-medium': 'font-weight: 500;',
  'font-semibold': 'font-weight: 600;',
  'font-bold': 'font-weight: 700;',
  'font-extrabold': 'font-weight: 800;',
  'font-black': 'font-weight: 900;',

  // Borders
  border: 'border-width: 1px;',
  'border-0': 'border-width: 0;',
  'border-2': 'border-width: 2px;',
  'border-4': 'border-width: 4px;',
  'border-8': 'border-width: 8px;',
  rounded: 'border-radius: 0.25rem;',
  'rounded-none': 'border-radius: 0;',
  'rounded-sm': 'border-radius: 0.125rem;',
  'rounded-md': 'border-radius: 0.375rem;',
  'rounded-lg': 'border-radius: 0.5rem;',
  'rounded-xl': 'border-radius: 0.75rem;',
  'rounded-2xl': 'border-radius: 1rem;',
  'rounded-3xl': 'border-radius: 1.5rem;',
  'rounded-full': 'border-radius: 9999px;',

  // Shadows
  'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0, 0, 0, 0.05);',
  shadow: 'box-shadow: 0 1px 3px 0 rgb(0, 0, 0, 0.1), 0 1px 2px 0 rgb(0, 0, 0, 0.06);',
  'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0, 0, 0, 0.1), 0 2px 4px -1px rgb(0, 0, 0, 0.06);',
  'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0, 0, 0, 0.1), 0 4px 6px -2px rgb(0, 0, 0, 0.05);',
  'shadow-xl':
    'box-shadow: 0 20px 25px -5px rgb(0, 0, 0, 0.1), 0 10px 10px -5px rgb(0, 0, 0, 0.04);',
  'shadow-2xl': 'box-shadow: 0 25px 50px -12px rgb(0, 0, 0, 0.25);',

  // Overflow
  'overflow-hidden': 'overflow: hidden;',
  'overflow-visible': 'overflow: visible;',
  'overflow-scroll': 'overflow: scroll;',
  'overflow-auto': 'overflow: auto;',
  'overflow-x-hidden': 'overflow-x: hidden;',
  'overflow-y-hidden': 'overflow-y: hidden;',
  'overflow-x-auto': 'overflow-x: auto;',
  'overflow-y-auto': 'overflow-y: auto;',

  // Z-index
  'z-0': 'z-index: 0;',
  'z-10': 'z-index: 10;',
  'z-20': 'z-index: 20;',
  'z-30': 'z-index: 30;',
  'z-40': 'z-index: 40;',
  'z-50': 'z-index: 50;',
  'z-auto': 'z-index: auto;',

  // Whitespace
  'whitespace-normal': 'white-space: normal;',
  'whitespace-nowrap': 'white-space: nowrap;',
  'whitespace-pre': 'white-space: pre;',
  'whitespace-pre-line': 'white-space: pre-line;',
  'whitespace-pre-wrap': 'white-space: pre-wrap;',
};

/**
 * Convert a single Tailwind class to CSS
 */
function convertTailwindClass(twClass) {
  if (tailwindMappings[twClass]) {
    return tailwindMappings[twClass];
  }

  // Handle responsive prefixes
  if (twClass.startsWith('sm:')) {
    const baseClass = twClass.slice(3);
    const css = tailwindMappings[baseClass];
    if (css) {
      return `@media (min-width: 640px) { ${css} }`;
    }
  }

  if (twClass.startsWith('md:')) {
    const baseClass = twClass.slice(3);
    const css = tailwindMappings[baseClass];
    if (css) {
      return `@media (min-width: 768px) { ${css} }`;
    }
  }

  if (twClass.startsWith('lg:')) {
    const baseClass = twClass.slice(4);
    const css = tailwindMappings[baseClass];
    if (css) {
      return `@media (min-width: 1024px) { ${css} }`;
    }
  }

  if (twClass.startsWith('xl:')) {
    const baseClass = twClass.slice(3);
    const css = tailwindMappings[baseClass];
    if (css) {
      return `@media (min-width: 1280px) { ${css} }`;
    }
  }

  if (twClass.startsWith('2xl:')) {
    const baseClass = twClass.slice(4);
    const css = tailwindMappings[baseClass];
    if (css) {
      return `@media (min-width: 1536px) { ${css} }`;
    }
  }

  return null;
}

/**
 * Convert multiple Tailwind classes to CSS
 */
function convertTailwindClasses(twClasses) {
  const cssRules = [];
  const mediaQueries = {};

  twClasses.forEach((twClass) => {
    const css = convertTailwindClass(twClass.trim());
    if (css) {
      if (css.startsWith('@media')) {
        // Handle media queries
        if (!mediaQueries[css]) {
          mediaQueries[css] = [];
        }
        // This is a simplified approach - in practice, you'd need more sophisticated parsing
      } else {
        cssRules.push(css);
      }
    }
  });

  return cssRules.join(' ');
}

/**
 * Generate a CSS module file from component analysis
 */
function generateCSSModule(componentName, tailwindClasses) {
  const cssContent = `/* ${componentName} Component Styles */\n\n`;

  // Add converted styles
  const convertedCSS = convertTailwindClasses(tailwindClasses);

  return (
    cssContent +
    `.${componentName.toLowerCase()} {\n  ${convertedCSS.split(';').join(';\n  ')}\n}\n`
  );
}

// Export for use in other scripts
module.exports = {
  convertTailwindClass,
  convertTailwindClasses,
  generateCSSModule,
  tailwindMappings,
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node convert-tailwind.js "class1 class2 class3"');
    console.log('Example: node convert-tailwind.js "bg-blue-500 text-white p-4"');
    process.exit(1);
  }

  const classes = args.join(' ').split(' ');
  const css = convertTailwindClasses(classes);
  console.log(css);
}
