import { useContext } from 'react';

import { AppContext } from '../../context/AppContext';
import LeftBarMenuItem, { LeftBarLinkProps } from './LeftBarMenuItem';
import BarToggler from '../common/toggler/BarToggler';

import { ReactComponent as HomeLineIcon } from '../../static/img/home-line.svg';

import './LeftBar.sass';

const HOME_LINK: LeftBarLinkProps = {
    id: 'home',
    label: 'Home',
    href: '/home',
    icon: <HomeLineIcon className="svg-stroke" />,
};


interface LeftBarProps {}

const LeftBar: React.FC<LeftBarProps> = () => {
    const { leftBarExpanded, onLeftBarExpand } = useContext(AppContext);
    const links = [HOME_LINK];

    return (
        <>
            <div
                id="left-bar-logo"
                className={`left-bar left-bar-logo ${
                    leftBarExpanded ? 'exp' : 'min'
                }`}
            >
                <div className="left-bar-logo-container">
                    <img
                        src={process.env.REACT_APP_BRAND_LOGO_PATH || ''}
                        alt={`${process.env.REACT_APP_BRAND_NAME} Logo`}
                    />
                </div>
            </div>
            <div
                id="left-bar-menu"
                className={`left-bar left-bar-menu ${
                    leftBarExpanded ? 'exp' : 'min'
                }`}
            >
                <div className="left-bar-menu-items">
                    {links.map((link: LeftBarLinkProps) => (
                        <LeftBarMenuItem
                            {...link}
                            selected={
                                window.location.pathname.startsWith(
                                    link.href
                                )
                            }
                            key={`leftbar-menu-item-${link['id']}`}
                        />
                    ))}
                </div>

                <div className="left-bar-menu-items">
                    {leftBarExpanded && (
                        <div className="left-bar-hub-version">
                            v.{process.env.REACT_APP_HUB_TAG}
                        </div>
                    )}
                    <BarToggler
                        direction={leftBarExpanded ? 'left' : 'right'}
                        title={leftBarExpanded ? 'Minimize' : 'Expand'}
                        onClick={() => onLeftBarExpand(!leftBarExpanded)}
                    />
                </div>
            </div>
        </>
    );
};

export default LeftBar;
