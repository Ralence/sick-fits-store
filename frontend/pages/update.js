import UpdateItem from '../components/UpdateItem';

export default function update(props) {
  return (
    <div>
      <UpdateItem id={props.query.id} />
    </div>
  );
}
