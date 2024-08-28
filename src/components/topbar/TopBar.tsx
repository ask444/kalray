import './TopBar.sass';

interface TopBarProps {
    label: string;
}

const TopBar: React.FC<TopBarProps> = ({ label }) => {
    return (
        <div className="top-bar" id="top-bar">
            <div className="top-bar-content">
                <div className="top-bar-label">{label}</div>
            </div>
        </div>
    );
};

export default TopBar;
