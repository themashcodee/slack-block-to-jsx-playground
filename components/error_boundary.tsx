import { Component, ErrorInfo, ReactNode } from "react"

interface Props {
	children?: ReactNode
	fallback?: ReactNode
	onReset?: () => void
}

interface State {
	hasError: boolean
	error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	}
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo)
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null })
		if (this.props.onReset) {
			this.props.onReset()
		}
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className="w-full h-full flex flex-col items-center justify-center p-8">
					<div className="max-w-sm text-center space-y-4">
						<div className="w-10 h-10 rounded-ds-lg bg-ds-error-subtle flex items-center justify-center mx-auto">
							<svg
								className="w-5 h-5 text-ds-error"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
								/>
							</svg>
						</div>
						<h2 className="text-ds-base font-medium text-ds-text-primary">
							Something went wrong
						</h2>
						<p className="text-ds-sm text-ds-text-tertiary">
							{this.state.error?.message || "An unexpected error occurred"}
						</p>
						<button onClick={this.handleReset} className="ds-btn ds-btn-ghost">
							Try again
						</button>
					</div>
				</div>
			)
		}
		return this.props.children
	}
}
