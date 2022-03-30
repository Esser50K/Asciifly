import { useEffect, useState } from 'react';
import './DownloadButton.css';


interface DownloadButtonProps {
    downloading: boolean
    onClick: () => void
}

function DownloadButton(props: DownloadButtonProps) {
    const [downloadingIdx, setDownloadingIdx] = useState(0)

    const downloadingFile = [
        `downloading.`,
        `downloading..`,
        `downloading...`
    ]

    useEffect(() => {
        if (props.downloading) {
            setDownloadAnim()
            return
        }
    }, [props.downloading, downloadingIdx])

    const setDownloadAnim = async () => {
        await new Promise((resolve => setTimeout(resolve, 300)))
        setDownloadingIdx((downloadingIdx + 1) % downloadingFile.length)
    }

    return (
        <div
            className="download-btn"
            style={!props.downloading ? { textAlign: "center" } : {}}
            onClick={(() => props.onClick())}>
            <div className="download-btn-content">
                {
                    props.downloading ?
                        downloadingFile[downloadingIdx]
                        : "download"
                }
            </div>
        </div>
    );
}

export default DownloadButton;
