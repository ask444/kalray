import Tooltip from '../tooltip/Tooltip';

import { ReactComponent as BarTogglerOuterIcon } from '../../../static/img/bar-toggler-outer-icon@2x.svg';
import { ReactComponent as ChevronRightIcon } from '../../../static/img/chevron-right@2x.svg';

import './BarToggler.sass';

interface BarTogglerProps {
    direction: 'left' | 'right' | 'bottom' | 'top';
    title: string;
    onClick: () => void;
}

const BarToggler: React.FC<BarTogglerProps> = ({
    direction,
    title,
    onClick,
}) => {
    return (
        <Tooltip
            value={title}
            placement={direction === 'left' ? 'left' : 'right'}
            allowCopy={false}
            boldText={true}
        >
            <div className={`bar-toggler point-${direction}`} onClick={onClick}>
                <div className="bar-toggler-content">
                    <div className="bar-toggler-icon-group">
                        <div className="bar-toggler-outer-icon">
                            <BarTogglerOuterIcon className="svg-stroke" />
                        </div>
                        <div className="bar-toggler-icon">
                            <ChevronRightIcon className="svg-stroke" />
                        </div>
                    </div>
                </div>
            </div>
        </Tooltip>
    );
};

export default BarToggler;
