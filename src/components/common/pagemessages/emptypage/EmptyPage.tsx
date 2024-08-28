import { ReactComponent as FileSearchIcon } from '../../../../static/img/file-search-02.svg';
import { ReactComponent as ToolIcon } from '../../../../static/img/tool-02.svg';
import { ReactComponent as CheckCircleIcon } from '../../../../static/img/check-circle.svg';
import { ReactComponent as XCircleIcon } from '../../../../static/img/x-circle.svg';
import { ReactComponent as EyeOffIcon } from '../../../../static/img/eye-off.svg';
import { ReactComponent as SearchReflectionIcon } from '../../../../static/img/search-reflection.svg';

import './EmptyPage.sass';

type PageMessageType =
    | 'empty'
    | 'config_required'
    | 'no_action_required'
    | 'not_found'
    | 'not_allowed'
    | 'search_help';

interface EmptyPageProps {
    title: string;
    msgType?: PageMessageType;
}

const getIconForMsgType = (msgType: PageMessageType) => {
    if (msgType === 'config_required') {
        return <ToolIcon className="svg-stroke" />;
    } else if (msgType === 'no_action_required') {
        return <CheckCircleIcon className="svg-stroke" />;
    } else if (msgType === 'not_found') {
        return <XCircleIcon className="svg-stroke" />;
    } else if (msgType === 'not_allowed') {
        return <EyeOffIcon className="svg-stroke" />;
    } else if (msgType === 'search_help') {
        return <SearchReflectionIcon className="svg-stroke" />;
    } else {
        return <FileSearchIcon className="svg-stroke" />;
    }
};

const EmptyPage: React.FC<EmptyPageProps> = ({ title, msgType = 'empty' }) => {
    return (
        <div className="empty-page-msg-container">
            <div className="empty-page-icon">{getIconForMsgType(msgType)}</div>
            <div className="empty-page-msg">{title}</div>
        </div>
    );
};

export default EmptyPage;
