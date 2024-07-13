"use client"

import React from "react"
import { Block, Message } from "slack-blocks-to-jsx"

const blocks10: Block[] = [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "Hello <@HSUHD1>",
		},
	},
]
const blocks11: Block[] = [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "Hello <@HSUHD2>",
		},
	},
]
export const blocks = [blocks10, blocks11]

export const Test = () => {
	return (
		<div className="w-full flex flex-col gap-6 max-w-[500px] mx-auto bg-white p-6 rounded-xl">
			{blocks.map((block, i) => {
				return (
					<Message
						key={i}
						logo="https://static-00.iconduck.com/assets.00/slack-icon-2048x2048-5nfqoyso.png"
						name="Random"
						time={new Date()}
						blocks={block}
						data={{
							users:
								i === 0
									? [
											{
												id: "HSUHD1",
												name: "Mash 1",
											},
									  ]
									: [
											{
												id: "HSUHD2",
												name: "Mash 2",
											},
									  ],
						}}
					/>
				)
			})}
		</div>
	)
}
