import './TextInput.css';


interface TextInputProps {
    onChange: (e: string) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function TextInput(props: TextInputProps) {
    return (
        <form className="yt-url-input-form" onSubmit={(e) => { props.onSubmit(e) }}>
            <label className="yt-url-input-label" htmlFor="yt-url-input-input">paste a Youtube URL to asciify it on the fly</label>
            <input id="yt-url-input-input" className="yt-url-input-input" type="text" onChange={(e) => props.onChange(e.target.value)}></input>
        </form>
    );
}

export default TextInput;
