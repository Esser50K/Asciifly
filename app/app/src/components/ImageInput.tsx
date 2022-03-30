import { useState, useEffect, useRef } from 'react';
import './ImageInput.css';


interface ImageInputProps {
    onImageSubmit: (e: File) => void
}

function ImageInput(props: ImageInputProps) {
    const imgInput = useRef(null)
    const [fileIsHovering, setFileIsHovering] = useState(false)
    const [wrongFileType, setWrongFileType] = useState(false)

    let dragInCount = 0
    const supportedImageTypes = ["image/jpeg", "image/jpg", "image/png"]
    const handleDrag = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragIn = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dragInCount++
        if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
            setWrongFileType(false)
            setFileIsHovering(true)
            if (!supportedImageTypes.includes(e.dataTransfer.items[0].type)) {
                setWrongFileType(true)
            }
        }
    }
    const handleDragOut = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dragInCount--
        if (dragInCount > 0)
            return

        setFileIsHovering(false);
        setWrongFileType(false)
    }
    const handleDrop = async (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setFileIsHovering(false)
        setWrongFileType(false)

        if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
            const file = e.dataTransfer.items[0].getAsFile()
            if (file === null) {
                return
            }
            if (!supportedImageTypes.includes(file.type)) {
                return;
            }

            props.onImageSubmit(file)
        }
    }

    const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files ? e.target.files[0] : null;
        if (f === null) {
            return;
        }

        props.onImageSubmit(f);
    }

    useEffect(() => {
        if (imgInput.current === null) {
            return
        }

        const div = imgInput.current! as HTMLDivElement
        div.addEventListener('dragenter', handleDragIn)
        div.addEventListener('dragleave', handleDragOut)
        div.addEventListener('dragover', handleDrag)
        div.addEventListener('drop', handleDrop)

        return () => {
            div.removeEventListener('dragenter', handleDragIn)
            div.removeEventListener('dragleave', handleDragOut)
            div.removeEventListener('dragover', handleDrag)
            div.removeEventListener('drop', handleDrop)
        }
    }, [])

    return (
        <div className="img-input-container">
            <div ref={imgInput}
                className={"img-input-box " +
                    (fileIsHovering ?
                        wrongFileType ? "img-input-with-wrong-file" : "img-input-with-file"
                        : "img-input-without-file")}
                style={{ cursor: 'pointer' }}
                onClick={() => document.getElementById("file-input")?.click()}>
                <input type="file"
                    accept="image/png, image/jpeg"
                    id="file-input"
                    style={{ "display": "none" }}
                    onChange={handleSelectImage}>
                </input>
                <div className="img-input-text">
                    {fileIsHovering ?
                        wrongFileType ? "Unsupported file type" : "Drop the image now"
                        : "Click to select or drag an image on this box to asciify it"}
                </div>
            </div>
        </div>
    );
}

export default ImageInput;
