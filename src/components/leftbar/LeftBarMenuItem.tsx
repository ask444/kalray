import { HTMLAttributeAnchorTarget, useContext } from 'react';

import { AppContext } from '../../context/AppContext';
import Tooltip from '../common/tooltip/Tooltip';

import './LeftBarMenuItem.sass';

export interface LeftBarLinkProps {
    id: string;
    label: string;
    href: string;
    icon: any;
    target?: HTMLAttributeAnchorTarget;
}

interface LeftBarMenuItemProps extends LeftBarLinkProps {
    onClick?: () => void;
    selected?: boolean;
}

interface LeftBarMinMenuItemProps extends LeftBarLinkProps {}
interface LeftBarExpMenuItemProps extends LeftBarLinkProps {}

const LeftBarMinMenuItem: React.FC<LeftBarMinMenuItemProps> = (props) => {
    return (
        <div className="left-bar-min-menu-item">
            <div className="left-bar-menu-item-icon">{props.icon}</div>
        </div>
    );
};

const LeftBarExpMenuItem: React.FC<LeftBarExpMenuItemProps> = (props) => {
    return (
        <div className="left-bar-exp-menu-item">
            <LeftBarMinMenuItem {...props} />
            <div className="left-bar-menu-item-label valign-text-middle">
                {props.label}
            </div>
        </div>
    );
};

const LeftBarMenuItem: React.FC<LeftBarMenuItemProps> = ({
    onClick,
    selected = false,
    ...linkProps
}) => {
    const { leftBarExpanded } = useContext(AppContext);

    return (
        <a
            className={`left-bar-menu-item ${selected ? 'selected' : ''}`}
            href={linkProps.href}
            target={linkProps.target ?? '_self'}
            onClick={onClick}
        >
            <Tooltip
                value={linkProps.label}
                boldText={true}
                allowCopy={false}
                placement="right"
            >
                {leftBarExpanded ? (
                    <LeftBarExpMenuItem {...linkProps} />
                ) : (
                    <LeftBarMinMenuItem {...linkProps} />
                )}
            </Tooltip>
        </a>
    );
};

export default LeftBarMenuItem;
