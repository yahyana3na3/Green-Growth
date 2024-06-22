import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Calendar.css';
import Menu from '../components/Menu';

const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [toDoList, setToDoList] = useState(() => {
    const savedToDoList = localStorage.getItem('toDoList');
    return savedToDoList ? JSON.parse(savedToDoList) : [];
  });
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
  }, [toDoList]);

  const handleDateClick = date => {
    setStartDate(date);
    setShowEventSelector(true);
  };

  const handleEventSelect = event => {
    setSelectedEvent(event);
    setShowEventSelector(false);
    const newItem = {
      event,
      date: startDate.toISOString(),
      done: false
    };
    setToDoList(prevList => [...prevList, newItem]);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedItems([]);
  };

  const handleDelete = () => {
    const newList = toDoList.filter((_, index) => !selectedItems.includes(index));
    setToDoList(newList);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleDone = (index) => {
    const newList = [...toDoList];
    newList[index].done = true;
    newList[index].doneAt = new Date().toISOString();
    setToDoList(newList);
  };

  const handleItemCheckboxChange = (index, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, index]);
    } else {
      setSelectedItems(selectedItems.filter(itemIndex => itemIndex !== index));
    }
  };

  const getEventColor = event => {
    switch (event) {
      case 'Irrigation':
        return '#007bff';
      case 'Fertilization':
        return '#28a745';
      case 'Pruning':
        return '#fd7e14';
      case 'Pest Control':
        return '#dc3545';
      case 'Harvesting':
        return '#6f42c1';
      case 'Seasonal Tasks':
        return '#ffc107';
      default:
        return '#000';
    }
  };

  const categorizeItems = (toDoList) => {
    const today = new Date();
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 7);
    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() + 1);
    const thisYear = new Date(today);
    thisYear.setFullYear(thisYear.getFullYear() + 1);

    const todayItems = [];
    const thisWeekItems = [];
    const thisMonthItems = [];
    const thisYearItems = [];
    const unfinishedTasks = [];

    toDoList.forEach((item, index) => {
      const itemDate = new Date(item.date);
      if (!item.done && itemDate < today) {
        unfinishedTasks.push({ ...item, index });
      } else if (itemDate <= today) {
        todayItems.push({ ...item, index });
      } else if (itemDate <= thisWeek) {
        thisWeekItems.push({ ...item, index });
      } else if (itemDate <= thisMonth) {
        thisMonthItems.push({ ...item, index });
      } else if (itemDate <= thisYear) {
        thisYearItems.push({ ...item, index });
      }
    });

    return {
      'Today': todayItems,
      'This Week': thisWeekItems,
      'This Month': thisMonthItems,
      'This Year': thisYearItems,
      'Unfinished Tasks': unfinishedTasks
    };
  };

  const categorizedItems = categorizeItems(toDoList);

  return (
    <div className="calendar-container">
      <header>
        <Menu />
      </header>
      <DatePicker
        selected={startDate}
        onChange={date => handleDateClick(date)}
        inline
      />
      {showEventSelector && (
        <div className="event-selector">
          <div className="event-selector-inner">
            <label htmlFor="events" className="event-label">Select Task:</label>
            <select id="events" value={selectedEvent} onChange={e => handleEventSelect(e.target.value)} className="event-select">
              <option value="">Select Task</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Fertilization">Fertilization</option>
              <option value="Pruning">Pruning</option>
              <option value="Pest Control">Pest Control</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Seasonal Tasks">Seasonal Tasks</option>
            </select>
          </div>
        </div>
      )}
      <div className="to-do-list">
        <div className="list-header">
          {!isSelectionMode && (
            <button onClick={toggleSelectionMode}>Select Items</button>
          )}
          {isSelectionMode && (
            <>
              <button onClick={toggleSelectionMode}>Cancel Selection</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
        <h2 className="to-do-header" id="tasks-list">Tasks-List</h2>
        {Object.keys(categorizedItems).map(category => (
          <div key={category}>
            <h3 id={category}>{category}</h3>
            <ul className="to-do-ul">
              {categorizedItems[category].map(({ event, date, index, done }) => (
                <li key={index} className={`to-do-li ${selectedItems.includes(index) ? 'selected' : ''} ${done ? 'done' : ''}`}>
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={e => handleItemCheckboxChange(index, e.target.checked)}
                    />
                  )}
                  <span className="event-color" style={{ backgroundColor: getEventColor(event) }}></span>
                  <span>{new Date(date).toLocaleDateString()}: {event}</span>
                  {!done && !isSelectionMode && <button onClick={() => handleDone(index)}>Done</button>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;