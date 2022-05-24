import './Toast.css';

interface ToastProps {
    text: String
}

function Toast(props: ToastProps) {
    return (
        <div className='toast-container bottom-left'>
            <div className='notification'>
                {props.text}
            </div>
        </div>
    )
}


export default Toast;