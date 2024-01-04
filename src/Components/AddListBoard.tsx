import Button from "./Button";
import Icon from "./Icon";
import { MdAdd } from "react-icons/md";

const AddListBoard = () => {
  // const [show, setShow] = useState(false);
  // const [listName, setListName] = useState("");

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setListName(e.target.value);
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (listName) {
  //     const newList: IList = {
  //       id: uuidv4(),
  //       name: listName,
  //       cards: [],
  //     };
  //     addList(newList);
  //     setListName("");
  //     handleClose();
  //   }
  // };

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Add List
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>List Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter List Name"
                value={listName}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add List
            </Button>
          </Form>
        </Modal.Body>
      </Modal> */}
      <Button text="Add new ListBoard" secondary className="hidden md:flex"/>
      <Icon IconName={MdAdd}  className="block md:hidden" />

    </>
  );
};

export default AddListBoard;