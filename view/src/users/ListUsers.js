import "./ListUsers.css";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFilters, useSortBy, useTable } from "react-table";
import { DefaultColumnFilter } from "./../tables/DefaultColumnFilter";

export const ListUsers = () => {
  const data = useMemo(
      () => [
        {
          email_address: "abc123@duke.edu",
          name: "Amy Bac Cant",
          administrator: "false"
        },
        {
          email_address: "thatperson@randommiddle.edu",
          name: "That Person",
          address: "33 Real St, City, State",
          administrator: "true",
          students: "This Person, A Person"
        },
        {
          email_address: "canada@element.com",
          name: "Frederick Beacon",
          address: "7 Canda Rd, Alberta, CA",
          administrator: "true"
        }
      ],
      []
  );

  const columns = useMemo(
      () => [
        {
          Header: 'Email Address',
          Filter: DefaultColumnFilter,
          accessor: 'email_address'
        },
        {
          Header: 'Full Name',
          Filter: DefaultColumnFilter,
          accessor: 'name'
        },
        {
          Header: 'Address',
          disableFilters: true,
          accessor: 'address'
        },
        {
          Header: 'Administrator',
          disableFilters: true,
          accessor: 'administrator'
        },
        {
          Header: 'Students',
          disableFilters: true,
          accessor: 'students'
        }
      ],
      []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data },
      useFilters,
      useSortBy);
  return (
      <div id="userListing">
        <h1>List Schools</h1>
        <Link to="/Users/create">
          <button>Create User</button>
        </Link>
        <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
          <thead>
          {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th
                        {...column.getHeaderProps((column.id === "name" || column.id === "email_address") && column.getSortByToggleProps())}
                        style={column.id === "name" || column.id === "email_address" ? {
                          borderBottom: 'solid 3px red',
                          background: 'aliceblue',
                          color: 'black',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        } : {
                          borderBottom: 'solid 3px red',
                          background: 'aliceblue',
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                    >
                      {column.render('Header')}
                      <div>{column.canFilter && column.render('Filter')}</div>
                    </th>
                ))}
              </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                        <td
                            {...cell.getCellProps()}
                            style={{
                              padding: '10px',
                              border: 'solid 1px gray',
                              background: 'papayawhip',
                            }}
                        >
                          <Link to="/Users/info">
                            {cell.render('Cell')}
                          </Link>
                        </td>
                    )
                  })}
                </tr>
            )
          })}
          </tbody>
        </table>
      </div>
  );
}