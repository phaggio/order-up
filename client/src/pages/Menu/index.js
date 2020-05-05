import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/index';
import { Container, Col, Row } from 'react-bootstrap';
import DropDownInput from '../../components/DropDownInput/index';
import DataTable from '../../components/DataTable';
import API from '../../utils/menuAPI';
import InputModal from '../../components/InputModal';
import EditBar from '../../components/EditBar/index';

function Menu() {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [modalTitle, setModalTitle] = useState();
  const [submitButtonLabel, setSubmitButtonLabel] = useState(`Submit`);
  const [itemInfo, setItemInfo] = useState({});

  useEffect(() => {
    loadMenu();
  }, []);

  function loadMenu() {
    API.getMenu()
      .then((res) => {
        const menu = res.data.map((item) => {
          return {
            _id: item._id,
            category: item.category,
            name: item.name,
            price: item.price,
            description: item.description,
            pairing: item.pairing,
            prepareTime: item.prepareTime,
            itemCount: item.itemCount
          };
        });
        const filteredMenu = [...menu];
        setMenu(menu);
        setFilteredMenu(filteredMenu);
      })
      .catch((err) => console.error(err));
  }

  function handleInputChange(event) {
    const inputText = event.target.value;
    setFilteredMenu(
      menu.filter((item) => {
        const words = item.name.split(' ');
        let isMatch = false;

        words.forEach((word) => {
          if (word.toLowerCase().startsWith(inputText.toLowerCase())) {
            isMatch = true;
          }
        });

        return isMatch;
      })
    );
  }
  const addButtonPressed = () => {
    setInputs([...uniqueItemArr, ...otherItemArr]);
    setModalTitle(`Add Menu Item`);
    setSubmitButtonLabel(`Submit`);
    setShowAddModal(true);
  };

  function submitButtonPressed(event) {
    event.preventDefault();
    if (
      itemInfo.category &&
      itemInfo.name &&
      itemInfo.price &&
      itemInfo.description &&
      itemInfo.pairing &&
      itemInfo.prepareTime
    ) {
      API.addMenuItem(itemInfo).then((res) => {
        console.log(`status code: ${res.status}`);
        loadMenu();
        setShowAddModal(false);
      });
    } else {
      alert(`Please fill out all required fields with appropriate input`);
    }
  }
  const updateMenuInfoState = (event) => {
    const { name, value } = event.target;
    setItemInfo((info) => ({ ...info, [name]: value }));
  };
  const clickCheckbox = (event) => {
    const checked = event.target.checked;
    const selectedId = event.target.getAttribute(`data-id`);
    if (checked) {
      setSelectedMenuItems([...selectedMenuItems, selectedId]);
    } else {
      setSelectedMenuItems(selectedMenuItems.filter((id) => id !== selectedId));
    }
  };
  const editButtonPressed = () => {
    console.log(`Edit button pressed!`);
    if (selectedMenuItems.length > 1) {
      console.log(`More than 1 employee selected`);
      setInputs(otherItemArr);
      setModalTitle(`Edit items`);
    } else {
      console.log(`Only 1 employee selected`);
      setItemInfo(menu.find((menu) => menu._id === selectedMenuItems[0]));
      setInputs([...uniqueItemArr, ...otherItemArr]);
      setModalTitle(`Edit item`);
    }
    setSubmitButtonLabel(`Save`);
    setShowAddModal(true);
  };
  const saveButtonPressed = () => {
    console.log(`Save button pressed`);
    API.updateManyMenuItem(selectedMenuItems, itemInfo)
      .then((res) => {
        console.log(`Status code ${res.status}`);
        console.log(`Affected records: ${res.data.n}`);
        if (res.data.n > 0) {
          setShowAddModal(false);
          loadMenu();
        } else {
          alert(
            `Something's wrong, we couldn't update employee info at this time...`
          );
        }
      })
      .catch((err) => console.error(err));
  };
  const deleteButtonPressed = () => {
    API.deleteManyMenuItems(selectedMenuItems)
      .then((res) => {
        console.log(`status code: ${res.status}`);
        if (res.data.n > 0) {
          loadMenu();
        }
      })
      .catch((err) => console.error(err));
  };
  const uniqueItemArr = [
    {
      name: `name`,
      label: `Item Name`,
      text: `Required`,
      type: `text`,
      placeholder: `Enter Item Name`,
      onChange: updateMenuInfoState
    },

    {
      name: `description`,
      label: `Item Description`,
      text: `Required`,
      type: `text`,
      placeholder: `Enter Item Description`,
      onChange: updateMenuInfoState
    }
  ];
  const otherItemArr = [
    {
      name: `category`,
      label: `Category`,
      text: `Required`,
      type: `text`,
      placeholder: `Enter Food or Beverage`,
      onChange: updateMenuInfoState
    },
    {
      name: `price`,
      label: `Item Price`,
      text: `Required`,
      type: `number`,
      placeholder: `Enter Item Price`,
      onChange: updateMenuInfoState
    },
    {
      name: `pairing`,
      label: `Item Pairing`,
      type: `text`,
      text: `Required`,
      placeholder: `Enter item pairing`,
      onChange: updateMenuInfoState
    },
    {
      name: `prepareTime`,
      label: `Item Prep Time`,
      text: `Required`,
      type: `number`,
      placeholder: `Enter Item Prep Time`,
      onChange: updateMenuInfoState
    },
    {
      name: `itemCount`,
      label: `Item Count`,
      placeholder: `Enter Item Count`,
      text: `Optional`,
      type: `number`,
      onChange: updateMenuInfoState
    }
  ];
  const menuItemsHeadingArr = [
    { key: `name`, heading: `Item Name` },
    { key: `category`, heading: `Category` },
    { key: `price`, heading: `Price` },
    { key: `pairing`, heading: `Pairing` },
    { key: `prepareTime`, heading: `Prep Time` },
    { key: `itemCount`, heading: `Count` }
  ];
  return (
    <div>
      <h1 className='d-flex justify-content-center display-4 text-white mt-5'>
        Menu
      </h1>
      <Container className='mt-5 mb-3'>
        <SearchBar
          className='col-12 rounded-sm'
          placeholder='Search inventory items'
          onChange={handleInputChange}
        />
      </Container>
      <div className='m-1'>
        <DropDownInput className='d-flex justify-content-center'>
          Sort by category
        </DropDownInput>
      </div>
      <InputModal
        show={showAddModal}
        cancel={() => {
          setShowAddModal(!showAddModal);
        }}
        title={modalTitle}
        submit={
          submitButtonLabel === `Submit`
            ? submitButtonPressed
            : saveButtonPressed
        }
        submitButtonLabel={submitButtonLabel}
        inputs={inputs}
        value={itemInfo ? itemInfo : undefined}
      />
      <Container className='d-flex justify-content-center mt-5'>
        <Col>
          <Row className='mb-1'>
            <EditBar
              noneSelected={selectedMenuItems.length ? false : true}
              delete={deleteButtonPressed}
              add={addButtonPressed}
              edit={editButtonPressed}
            />
            <DataTable
              headingArr={menuItemsHeadingArr}
              dataArr={filteredMenu}
              clickCheckbox={clickCheckbox}
              hideEdit={false}
            />
          </Row>
        </Col>
      </Container>
    </div>
  );
}
export default Menu;