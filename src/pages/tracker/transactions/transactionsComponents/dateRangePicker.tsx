import { useState } from "react";
import { Button, Segment, Popup, Icon } from "semantic-ui-react";

interface DateRangePickerProps {
  onDateRangeSelect: (startDate: string, endDate: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeSelect,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleApply = () => {
    if (startDate && endDate) {
      onDateRangeSelect(startDate, endDate);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setStartDate("");
    setEndDate("");
    setIsOpen(false);
  };

  return (
    <Popup
      wide
      trigger={
        <Button icon>
          <Icon name="calendar" /> Select Date Range
        </Button>
      }
      on="click"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <Segment>
        <div style={{ padding: "10px" }}>
          <h4>Select Date Range</h4>
          <div style={{ marginBottom: "10px" }}>
            <label>Start Date: </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>End Date: </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button primary onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </Segment>
    </Popup>
  );
};

export default DateRangePicker;
