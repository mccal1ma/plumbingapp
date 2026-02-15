import { useState, useMemo } from 'react'
import Wrapper from "../assets/wrappers/SearchContainer";
import { FormRow, FormRowSelect } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { handleChange, clearFilters } from "../features/allJobs/allJobsSlice";

const SearchContainer = () => {
  const [ localSearch, setLocalSearch ] = useState('')
  const { isLoading, searchStatus, searchType, sort, sortOptions } =
    useSelector((store) => store.allJobs);
  const dispatch = useDispatch();
  const { jobTypeOptions, statusOptions } = useSelector((store) => store.job);
  const handleSearch = (e) => {
    // dispatch an action
    dispatch(handleChange({ name: e.target.name, value: e.target.value }));
  };

  const debounce = () => {
    let timeoutID;
    return (e) => {
      setLocalSearch(e.target.value)
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {
        dispatch(handleChange({ name: e.target.name, value: e.target.value}))
      }, 1000)
    }
  }

  const optimizedDebounce = useMemo (() => debounce(), [debounce])

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSearch('')
    // dispatch an action to clear filters
    dispatch(clearFilters());
  };
  return (
    <Wrapper>
      <form className="form">
        <h4>search form </h4>
        <div className="form-center">
          {/* search position */}
          <FormRow
          type="text"
          name="search"
          value={localSearch}
          handleChange={optimizedDebounce}
          />
          {/* search by status */}
          <FormRowSelect
            name="searchStatus"
            labelText="status"
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          />
          {/* search by type */}
          <FormRowSelect
            name="searchType"
            labelText="Job Type"
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...jobTypeOptions]}
            
          />
          {/* sort */}
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={['all', ...sortOptions]}
            />
        </div>
        <div style={{marginTop: "1rem", justifyContent: "center", alignItems: "center", display: "flex"}}>

        <button
          className="btn btn-danger"
          style={{padding: "0.5rem 2rem", minWidth: "180px"}}
          disabled={isLoading}
          onClick={handleSubmit}
          >
          clear filters
        </button>
          </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
