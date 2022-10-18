import React, { useState, useEffect } from "react";
import { KeyBoolean } from "../../client/schemas";
import Checkbox from "./Checkbox";
import * as _ from "lodash";

interface ImageCheckboxListProps {
  id: string;
  options: { value: string; path: string; style?: any }[];
  checked: string[];
  listClassNames?: string;
  disabled?: boolean;
  selectAll?: boolean;
  onChange: (checked: string[]) => void;
}

const ImageCheckboxList = (props: ImageCheckboxListProps) => {
  const [checkedObject, setCheckedObject] = useState<KeyBoolean>(getCheckedObject());

  useEffect(() => {
    const checkedObject = getCheckedObject();
    setCheckedObject(checkedObject);
  }, [props.checked]);

  function getCheckedObject(): KeyBoolean {
    let optionsObject: KeyBoolean = {};
    props.options.forEach((option) => {
      optionsObject[option.value] = props.checked.indexOf(option.value as string) > -1;
    });
    return optionsObject;
  }

  function getCheckedArray(checkedObject: KeyBoolean): string[] {
    let checkedArray: string[] = [];
    _.forEach(checkedObject, (checked, value) => {
      if (checked) checkedArray.push(value);
    });
    return checkedArray;
  }

  function getSelectAllChecked(): boolean {
    const checked = getCheckedArray(checkedObject).length;
    const count = Object.keys(checkedObject).length;
    return checked === count;
  }

  const selectAllChange = (checked: boolean) => {
    let checkedObject: KeyBoolean = {};
    props.options.forEach((option) => {
      checkedObject[option.value] = checked;
    });
    const checkedArray = getCheckedArray(checkedObject);
    props.onChange(checkedArray);
  }

  const onChange = (value: string, checked: boolean) => {
    const newCheckedObject = _.assign({}, checkedObject);
    newCheckedObject[value] = checked;
    const checkedArray = getCheckedArray(newCheckedObject);
    props.onChange(checkedArray);
  }

  return <div className={props.listClassNames}>
    {props.selectAll &&
      <Checkbox classes="select-all" id={props.id + "-all"} disabled={!!props.disabled} checked={getSelectAllChecked()} onChange={selectAllChange} >Select all</Checkbox>}
    {
      props.options.map((row, i) => <Checkbox
        key={i}
        id={props.id + "-" + i}
        disabled={!!props.disabled}
        checked={checkedObject[row.value]}
        onChange={(checked) => { onChange(row.value as string, checked) }}
      ><img src={row.path} alt={row.value} style={row.style} />
      </Checkbox>)
    }
  </div>;
}
export default ImageCheckboxList;