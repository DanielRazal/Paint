import React from 'react'
import { BiColorFill } from 'react-icons/bi';
import { AiOutlineClear } from 'react-icons/ai';

function Header({ handleCanvasClear, handleFillCanvas, color, lineWidth, handleLineWidthChange }) {

    return (
        <div>
            <nav>
                <div className="flex flex-wrap items-center justify-between p-4">
                    <ul className="flex flex-row space-x-8">
                        <li>
                            <button
                                onClick={handleCanvasClear}
                                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                            >
                                <AiOutlineClear size={25} />
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleFillCanvas(color)}
                                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor"
                            >
                                <BiColorFill size={25} />
                            </button>
                        </li>

                        <li className="relative group">
                            <select
                                value={lineWidth}
                                onChange={(e) => handleLineWidthChange(e)}
                                className="block py-2 pl-3 pr-4 text-gray-900 rounded-md md:p-0 dark:text-white"
                            >
                                <option value={5}>5px</option>
                                <option value={7}>7px</option>
                                <option value={9}>9px</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-600 dark:text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                </svg>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header