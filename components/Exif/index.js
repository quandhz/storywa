import moment from 'moment';

const Exif = (props) => {
  return (
    <div>
      {props.description && <div>description {props.description}</div>}
      {props.createdAt && (
        <div>
          createdAt{' '}
          {moment(props.createdAt, 'YYYY:MM:DD HH:mm:ss').format(
            `ddd D MMM [']YY [at] h:mm a`,
          )}
        </div>
      )}
      {props.lastModified && (
        <div>
          lastModified{' '}
          {moment.utc(props.lastModified).format(`ddd D MMM [']YY [at] h:mm a`)}
        </div>
      )}
      {props.orientation && <div>orientation {props.orientation}</div>}
      {props.geo && (
        <div>
          {props.geo.lat} - {props.geo.lng}
        </div>
      )}
    </div>
  );
};

export default Exif;
