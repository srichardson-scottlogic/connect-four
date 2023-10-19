import './ResetButton.css';

export default function ResetButton({ resetStatus, onResetClick }) {
    return (
        <button className="reset" onClick={onResetClick}>{resetStatus}</button >
    );
}