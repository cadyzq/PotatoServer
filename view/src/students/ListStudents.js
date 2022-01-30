import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTable } from "react-table";
import { DefaultColumnFilter } from "./../tables/DefaultColumnFilter";
import { filterAllStudents } from "../api/axios_wrapper";

export const ListStudents = () => {
  const [ data, setData ] = useState([]);
  const [ page, setPage ] = useState(0);
  const [ total, setTotal ] = useState(1);
  const [ size, setSize ] = useState(10);
  const [ sortBy, setSortBy ] = useState("none");
  const [ sortDirec, setSortDirec ] = useState("none");
  const [ idFilter, setIdFilter ] = useState("");
  const [ lastNameFilter, setLastNameFilter ] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await filterAllStudents({
          page: page,
          size: size,
          sort: sortBy,
          sortDir: sortDirec,
          lastNameFilter: lastNameFilter,
          idFilter: idFilter
        });
        setData(fetchedData.data.students);
        setTotal(fetchedData.data.total);
      } catch (error) {
        alert(error.response.data);
      }
    };
    fetchData();
  }, [page, size, sortDirec, idFilter, lastNameFilter]);

  const nextSort = (id) => {
    if (sortBy !== id) {
      setSortBy(id);
      if (sortDirec === "none" || sortDirec === "DESC") {
        setSortDirec("ASC");
      } else {
        setSortDirec("DESC");
      }
    } else if (sortDirec === "ASC") {
      setSortDirec("DESC");
    } else if (sortDirec === "DESC") {
      setSortDirec("none");
    } else {
      setSortDirec("ASC");
    }
  }

  const columns = useMemo(
      () => [
        {
          Header: "First Name",
          accessor: "firstName",
        },
        {
          Header: "Middle Name",
          accessor: "middleName"
        },
        {
          HeaderName: "Last Name",
          accessor: "lastName"
        },
        {
          HeaderName: "ID",
          accessor: "id"
        },
        {
          HeaderName: "School",
          accessor: "school.name"
        },
        {
          Header: "Route",
          accessor: "route.name"
        },
        {
          Header: "Detail Page",
          accessor: "uid",
          Cell: (props) => {
            return <Link to={`/Students/info/${props.value}`}>view</Link>
          }
        }
      ],
      []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({ columns, data });
  return (
      <div id="userListing">
        <h1>List Students</h1>
        <Link to="/Users/create">
          <button>Create Student</button>
        </Link>
        <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
          <thead>
          {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                    <th
                        {...column.getHeaderProps()}
                        style={{
                          borderBottom: "solid 3px red",
                          background: "aliceblue",
                          color: "black",
                          fontWeight: "bold",
                        }
                        }
                    >
                      {column.id === "lastName" || column.id === "id" || column.id === "school.name" ? <div id="header">
                        <label onClick={() => {nextSort(column.id)}} style={{cursor: "pointer"}}>{column.HeaderName}</label>
                        {column.id === "school.name" || <DefaultColumnFilter setFilter={column.id === "id" ? setIdFilter : setLastNameFilter} />}
                      </div> : column.render("Header")}
                    </th>
                ))}
              </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                        <td
                            {...cell.getCellProps()}
                            style={{
                              padding: "10px",
                              border: "solid 1px gray",
                              background: "papayawhip",
                            }}
                        >
                          {cell.render("Cell")}
                        </td>
                    );
                  })}
                </tr>
            );
          })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => setPage(0)} disabled={page === 0}>
            {'<<'}
          </button>{' '}
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>
            {'<'}
          </button>{' '}
          <button onClick={() => setPage(page + 1)} disabled={page >= total/size - 1}>
            {'>'}
          </button>{' '}
          <button onClick={() => setPage(Math.ceil(total/size) - 1)} disabled={page >= total/size - 1}>
            {'>>'}
          </button>{' '}
          <span>
          Page{' '}
            <strong>
            {page + 1}
          </strong>{' '}
        </span>
          <span>
          | Go to page:{' '}
            <input
                type="number"
                defaultValue={page + 1}
                onChange={e => {
                  const pagee = e.target.value ? Number(e.target.value) - 1 : 0
                  setPage(pagee)
                }}
                style={{ width: '100px' }}
            />
        </span>{' '}
          <select
              value={size}
              onChange={e => {
                setSize(Number(e.target.value))
              }}
          >
            {[10, 20, 30, 40, 50].map(size => (
                <option key={size} value={size}>
                  Show {size} out of {total}
                </option>
            ))}
          </select>
        </div>
      </div>
  );
};
