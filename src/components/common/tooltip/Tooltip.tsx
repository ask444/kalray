import { ReactNode, useRef } from 'react';

import { Tooltip as MUITooltip } from '@mui/material';

import './Tooltip.sass';

interface TooltipProps {
    children: ReactNode; // trigger component for tooltip
    value: any; // used by default for appearence, copied on tooltip
    valueLabel?: ReactNode; // used to customize how value appears
    placement?:
        | 'bottom-end'
        | 'bottom-start'
        | 'bottom'
        | 'left-end'
        | 'left-start'
        | 'left'
        | 'right-end'
        | 'right-start'
        | 'right'
        | 'top-end'
        | 'top-start'
        | 'top';
    allowCopy?: boolean;
    boldText?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
    value,
    valueLabel,
    children,
    placement = 'bottom',
    boldText = false,
}) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <MUITooltip
                ref={tooltipRef}
                title={
                    <div className="tooltip-content" style={{ maxWidth: "200px" }}>
                        <div
                            className={`tooltip-label ${
                                !!boldText ? 'bold' : ''
                            }`}
                        >
                            {valueLabel ?? value}
                        </div>
                    </div>
                }
                componentsProps={{
                    tooltip: {
                        className: 'tooltip',
                    },
                    arrow: {
                        className: 'tooltip-arrow',
                    },
                }}
                placement={placement}
                arrow
            >
                <div>{children}</div>
            </MUITooltip>
        </>
    );
};

export default Tooltip;
