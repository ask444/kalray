import EmptyPage from './emptypage/EmptyPage';

interface NotFoundProps {
    title?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
    title = 'Sorry, we could not find the page you are looking for.',
}) => {
    return <EmptyPage msgType="not_found" title={title} />;
};

export default NotFound;
