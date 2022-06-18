import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Markdown({ content }) {
	return (
		<ReactMarkdown
			children={content.replace(/\n-/g, '\n\\-')}
			remarkPlugins={[[remarkGfm]]}
			components={{
				h1: ({ children }) => <h4>{children}</h4>,
				strong: ({ children }) => <u>{children}</u>,
				del: ({ children }) => (
					<strong>{children}</strong>
				)
			}}
		/>
	);
}

export default Markdown;
