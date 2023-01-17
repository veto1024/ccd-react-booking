import { useEffect, useRef, useState } from "react";
import { fetchMainMenu } from "../api/apiCalls";
import React from "react";
import {
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Container,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Theme,
  Toolbar,
  useTheme,
} from "@mui/material";

type MenuJSONResponseAPIType = MenuAPIObject[];

type MenuAPIObject = {
  key: string;
  title: string;
  description: string;
  uri: string;
  alias: string;
  external: boolean;
  absolute: string;
  relative: string;
  existing: boolean;
  weight: string;
  expanded: boolean;
  enabled: boolean;
  uuid: string | null;
  below?: MenuAPIObject[];
  menuID: string;
};
export default function CCDNavbar() {
  const [menuJSON, setMenuJSON] = useState<MenuJSONResponseAPIType | null>(
    null
  );
  const [menuFetched, setMenuFetched] = useState(false);
  const [open, setOpen] = useState<string>("");
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = (e: string) => {
    console.log(e);
    setOpen(e);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen("");
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen("");
    } else if (event.key === "Escape") {
      setOpen("");
    }
  }

  // return focus to the button when we transitioned from !open -> open
  // const prevOpen = React.useRef(open);

  useEffect(() => {
    if (!menuFetched) {
      fetchMainMenu().then((res) => {
        if (res.status === 200) {
          res.json().then((json: MenuJSONResponseAPIType) => {
            setMenuJSON(json);
            setMenuFetched(true);
          });
        }
      });
    }

    // if (prevOpen.current && !open) {
    //   anchorRef.current!.focus();
    // }
    // prevOpen.current = open;
  }, [open]);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        marginBottom: 3,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {menuJSON
              ? menuJSON.map((menuItem) => (
                  <CCDNavLink
                    {...menuItem}
                    key={menuItem.key}
                    menuID={menuItem.key}
                    handleClose={handleClose}
                    handleToggle={handleToggle}
                    anchorRef={anchorRef}
                    open={open}
                    handleListKeyDown={handleListKeyDown}
                  />
                ))
              : ""}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

    // <>
    //   {menuFetched ? (
    //     <Navbar
    //       expand="lg"
    //       variant="dark"
    //       style={{
    //         padding: ".5em",
    //       }}
    //     >
    //       <Navbar.Toggle aria-controls="navbar-collapse" id="navbar-toggle" />
    //       <Navbar.Collapse id="navbar-collapse">
    //         <Nav className="me-auto menu menu-main nav navbar-nav">
    //           {menuJSON
    //             ? menuJSON.map((menuItem, id) => (
    //                 <CCDNavLink key={id} {...menuItem} />
    //               ))
    //             : ""}
    //         </Nav>
    //       </Navbar.Collapse>
    //     </Navbar>
    //   ) : (
    //     ""
    //   )}
    // </>
  );
}

const CCDNavLink = (props: MenuAPIObject & DropdownHelperType) => {
  const { below } = props;

  return (
    <>
      {!below ? (
        <CCDNavLinkSingle {...props} />
      ) : (
        <CCDNavLinkDropdown {...props} />
      )}
    </>
  );
};

const CCDNavLinkSingle = (props: MenuAPIObject) => {
  console.log(`Single link: ${props.absolute}`);
  return (
    <>
      <MenuItem
        href={props.absolute}
        data-drupal-link-system-path={props.uri}
        component="a"
        target="_blank"
      >
        {props.title}
      </MenuItem>
    </>
  );
};

type DropdownHelperType = {
  handleClose: (arg0: MouseEvent | TouchEvent) => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  open: string;
  handleToggle: (arg0: string) => void;
  below?: MenuAPIObject[];
  handleListKeyDown: React.KeyboardEventHandler<HTMLUListElement> | undefined;
};
const CCDNavLinkDropdown = (props: DropdownHelperType & MenuAPIObject) => {
  const { open, handleToggle, title, below, handleClose, handleListKeyDown } =
    props;

  const theme = useTheme<Theme>();

  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <Button
        ref={anchorRef}
        id={`composition-button-${props.menuID}`}
        aria-controls={
          props.menuID === open ? `composition-menu-${props.menuID}` : undefined
        }
        aria-expanded={props.menuID === open ? "true" : undefined}
        aria-haspopup="true"
        onClick={() => handleToggle(props.menuID)}
      >
        {title}
      </Button>
      <Popper
        open={props.menuID === open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        style={{
          zIndex: 1501,
          boxShadow: theme.customShadows.z16,
        }}
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open === props.menuID}
                  id={`composition-menu-${props.menuID}`}
                  aria-labelledby={`composition-button-${props.menuID}`}
                  onKeyDown={handleListKeyDown}
                >
                  {below
                    ? below.map((item) => (
                        <CCDNavLinkSingle {...item} key={item.key} />
                      ))
                    : null}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
