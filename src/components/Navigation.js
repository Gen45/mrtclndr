import React, {Component} from 'react';

class Navigation extends Component {

  handleButton = (e, payload) => {
    e.preventDefault();

    payload();
  };

  render() {
    return (
      <header>
      <span className="pagination">
        <a className="prev">
          <i className="nc-icon-outline arrows-1_minimal-left"></i>
        </a>
        <a className="next">
          <i className="nc-icon-outline arrows-1_minimal-right"></i>
        </a>
      </span>
      <h2 className="title">
        <span className="segment">{this.props.segment}</span>
        <span className="detail">{this.props.year}</span>
      </h2>
      <nav className="main-filters">
        {/* <span className="filter-category time-filters time">
          <a id="trigger-time-tools" className="nav-trigger"><i className="nc-icon-mini ui-1_calendar-57"/>
            {" Date"}</a>
          <span className="time-tools">
            <div className="close-button"/>
            <a id="trigger-YEAR" className="nav-trigger f-trigger" data-route="year=all" data-filter="*" data-class="YEAR" data-time-segment="Years" data-time-detail="2017 - 2018">ALL</a>
            <a id="trigger-YEAR-17" className="nav-trigger f-trigger" data-route="year=17" data-filter=".YEAR-17" data-class="YEAR-17" data-time-segment="Year" data-time-detail={2017}>2017</a>
            <div className="nav-trigger dropdown">
              <span className="trigger">
                <i className="dropdown-toggle nc-icon-mini arrows-1_minimal-down"/>
              </span>
              <ul className="items">
                <li className="q">
                  <a id="trigger-Q1-17" className="nav-trigger f-trigger" data-filter=".Q1-17" data-class="Q1-17" data-time-segment="Q<sub>1</sub>" data-time-detail={2017}>Q<sub>1</sub>
                  </a>
                </li>
                <li className="q">
                  <a id="trigger-Q2-17" className="nav-trigger f-trigger" data-filter=".Q2-17" data-class="Q2-17" data-time-segment="Q<sub>2</sub>" data-time-detail={2017}>Q<sub>2</sub>
                  </a>
                </li>
                <li className="q">
                  <a id="trigger-Q3-17" className="nav-trigger f-trigger" data-filter=".Q3-17" data-class="Q3-17" data-time-segment="Q<sub>3</sub>" data-time-detail={2017}>Q<sub>3</sub>
                  </a>
                </li>
                <li className="q">
                  <a id="trigger-Q4-17" className="nav-trigger f-trigger" data-filter=".Q4-17" data-class="Q4-17" data-time-segment="Q<sub>4</sub>" data-time-detail={2017}>Q<sub>4</sub>
                  </a>
                </li>
                <hr className="month-trigger"/>
                <li className="month-trigger">
                  <a id="JAN-17" className="f-trigger" data-filter=".JAN-17" data-time-segment="January" data-time-detail="data-time-detail" data-class="MONTH">jan</a>
                </li>
                <li className="month-trigger">
                  <a id="FEB-17" className="f-trigger" data-filter=".FEB-17" data-time-segment="February" data-time-detail="data-time-detail" data-class="MONTH">feb</a>
                </li>
                <li className="month-trigger">
                  <a id="MAR-17" className="f-trigger" data-filter=".MAR-17" data-time-segment="March" data-time-detail="data-time-detail" data-class="MONTH">mar</a>
                </li>
                <li className="month-trigger">
                  <a id="APR-17" className="f-trigger" data-filter=".APR-17" data-time-segment="April" data-time-detail="data-time-detail" data-class="MONTH">apr</a>
                </li>
                <li className="month-trigger">
                  <a id="MAY-17" className="f-trigger" data-filter=".MAY-17" data-time-segment="May" data-time-detail="data-time-detail" data-class="MONTH">may</a>
                </li>
                <li className="month-trigger">
                  <a id="JUN-17" className="f-trigger" data-filter=".JUN-17" data-time-segment="June" data-time-detail="data-time-detail" data-class="MONTH">jun</a>
                </li>
                <li className="month-trigger">
                  <a id="JUL-17" className="f-trigger" data-filter=".JUL-17" data-time-segment="July" data-time-detail="data-time-detail" data-class="MONTH">jul</a>
                </li>
                <li className="month-trigger">
                  <a id="AUG-17" className="f-trigger" data-filter=".AUG-17" data-time-segment="August" data-time-detail="data-time-detail" data-class="MONTH">aug</a>
                </li>
                <li className="month-trigger">
                  <a id="SEP-17" className="f-trigger" data-filter=".SEP-17" data-time-segment="September" data-time-detail="data-time-detail" data-class="MONTH">sep</a>
                </li>
                <li className="month-trigger">
                  <a id="OCT-17" className="f-trigger" data-filter=".OCT-17" data-time-segment="October" data-time-detail="data-time-detail" data-class="MONTH">oct</a>
                </li>
                <li className="month-trigger">
                  <a id="NOV-17" className="f-trigger" data-filter=".NOV-17" data-time-segment="November" data-time-detail="data-time-detail" data-class="MONTH">nov</a>
                </li>
                <li className="month-trigger">
                  <a id="DEC-17" className="f-trigger" data-filter=".DEC-17" data-time-segment="December" data-time-detail="data-time-detail" data-class="MONTH">dec</a>
                </li>
              </ul>
            </div>
            <a id="trigger-YEAR-18" className="nav-trigger f-trigger" data-filter=".YEAR-18" data-class="YEAR-18" data-time-segment="Year" data-time-detail={2018}>2018</a>
            <div className="nav-trigger dropdown">
              <span className="trigger">
                <i className="dropdown-toggle nc-icon-mini arrows-1_minimal-down"/>
              </span>
              <ul className="items">
                <li className="q">
                  <a id="trigger-Q1-18" className="nav-trigger f-trigger" data-filter=".Q1-18" data-class="Q1-18" data-time-segment="Q<sub>1</sub>" data-time-detail={2018}>Q<sub>1</sub>
                  </a>
                </li>
                <li className="q">
                  <a id="trigger-Q2-18" className="nav-trigger f-trigger" data-filter=".Q2-18" data-class="Q2-18" data-time-segment="Q<sub>2</sub>" data-time-detail={2018}>Q<sub>2</sub>
                  </a>
                </li>
                <li className="q">
                  <a id="trigger-Q3-18" className="nav-trigger f-trigger" data-filter=".Q3-18" data-class="Q3-18" data-time-segment="Q<sub>3</sub>" data-time-detail={2018}>Q<sub>3</sub>
                  </a>
                </li>
                <li className="q">
                  <a id="trigger-Q4-18" className="nav-trigger f-trigger" data-filter=".Q4-18" data-class="Q4-18" data-time-segment="Q<sub>4</sub>" data-time-detail={2018}>Q<sub>4</sub>
                  </a>
                </li>
                <hr className="month-trigger"/>
                <li className="month-trigger">
                  <a id="JAN-18" className="f-trigger" data-filter=".JAN-18" data-time-segment="January" data-time-detail="data-time-detail" data-class="MONTH">jan</a>
                </li>
                <li className="month-trigger">
                  <a id="FEB-18" className="f-trigger" data-filter=".FEB-18" data-time-segment="February" data-time-detail="data-time-detail" data-class="MONTH">feb</a>
                </li>
                <li className="month-trigger">
                  <a id="MAR-18" className="f-trigger" data-filter=".MAR-18" data-time-segment="March" data-time-detail="data-time-detail" data-class="MONTH">mar</a>
                </li>
                <li className="month-trigger">
                  <a id="APR-18" className="f-trigger" data-filter=".APR-18" data-time-segment="April" data-time-detail="data-time-detail" data-class="MONTH">apr</a>
                </li>
                <li className="month-trigger">
                  <a id="MAY-18" className="f-trigger" data-filter=".MAY-18" data-time-segment="May" data-time-detail="data-time-detail" data-class="MONTH">may</a>
                </li>
                <li className="month-trigger">
                  <a id="JUN-18" className="f-trigger" data-filter=".JUN-18" data-time-segment="June" data-time-detail="data-time-detail" data-class="MONTH">jun</a>
                </li>
                <li className="month-trigger">
                  <a id="JUL-18" className="f-trigger" data-filter=".JUL-18" data-time-segment="July" data-time-detail="data-time-detail" data-class="MONTH">jul</a>
                </li>
                <li className="month-trigger">
                  <a id="AUG-18" className="f-trigger" data-filter=".AUG-18" data-time-segment="August" data-time-detail="data-time-detail" data-class="MONTH">aug</a>
                </li>
                <li className="month-trigger">
                  <a id="SEP-18" className="f-trigger" data-filter=".SEP-18" data-time-segment="September" data-time-detail="data-time-detail" data-class="MONTH">sep</a>
                </li>
                <li className="month-trigger">
                  <a id="OCT-18" className="f-trigger" data-filter=".OCT-18" data-time-segment="October" data-time-detail="data-time-detail" data-class="MONTH">oct</a>
                </li>
                <li className="month-trigger">
                  <a id="NOV-18" className="f-trigger" data-filter=".NOV-18" data-time-segment="November" data-time-detail="data-time-detail" data-class="MONTH">nov</a>
                </li>
                <li className="month-trigger">
                  <a id="DEC-18" className="f-trigger" data-filter=".DEC-18" data-time-segment="December" data-time-detail="data-time-detail" data-class="MONTH">dec</a>
                </li>
              </ul>
            </div>
          </span>
        </span> */}
        {/* <span className="filter-category sort">
          <a id="trigger-sort-tools" className="nav-trigger">
            <i className="nc-icon-mini design_bullet-list-67"/>
            {" Sort"}
          </a>
          <span className="sort-tools">
            <div className="close-button"/>
            <h4>By Date</h4>
            <a className="nav-trigger f-trigger active" id="trigger-SORT-BY-DATE-DESC"><i className="nc-icon-mini ui-1_calendar-57"/>
              Descending
              <i className="nc-icon-mini arrows-1_small-triangle-down"/></a>
            <br/>
            <a className="nav-trigger f-trigger" id="trigger-SORT-BY-DATE-ASC" data-target=".PAST-EVENT"><i className="nc-icon-mini ui-1_calendar-57"/>
              Ascending
              <i className="nc-icon-mini arrows-1_small-triangle-up"/></a>
            <br/>
            <h4>__</h4>
            <a className="nav-trigger f-trigger" id="trigger-SORT-BY-ACTIVITY_TYPE"><i className="nc-icon-mini ui-1_check-circle-07"/>
              By Activity Type</a>
          </span>
        </span> */}
        {/* <span className="filter-category tools">
          <input id="view-share" defaultValue="/"/>
          <a id="trigger-share-tools" className="nav-trigger">
            <i className="nc-icon-mini arrows-1_share-91"/>
            {" Share"}
          </a>
          <div className="share-tools">
            <div className="close-button"/>
            <h4>Download</h4>
            <a id="trigger-CSV" className="nav-trigger" title="Download as a CVS file (for Excel)"><i className="fa fa-file-excel-o" aria-hidden="true"/>
              CVS file (for Excel)</a>
            <br/>
            <a id="trigger-PDF" className="nav-trigger" title="Download PDF of the  current view"><i className="fa fa-file-pdf-o" aria-hidden="true"/>
              <span className="pdf-msg">PDF file</span>
            </a>
            <br/>
            <h4>Share</h4>
            <a id="trigger-SHARE" className="nav-trigger" data-clipboard-target="#view-share" title="Copy this view URL to the clipboard"><i className="nc-icon-mini ui-2_link-68"/>
              Copy URL</a>
            <br/>
            <h4>Snapshots</h4>
            <a id="trigger-SHARE" className="nav-trigger" data-clipboard-target="#view-share" title="Copy this view URL to the clipboard"><i className="nc-icon-mini files_single-content-03"/>
              View Snapshot</a>
            <a id="trigger-SHARE" className="nav-trigger" data-clipboard-target="#view-share" title="Copy this view URL to the clipboard"><i className="nc-icon-mini files_single-content-03"/>
              Download</a>
            <a id="trigger-SHARE" className="nav-trigger" data-clipboard-target="#view-share" title="Copy this view URL to the clipboard"><i className="nc-icon-mini files_single-content-03"/>
              Email</a>
          </div>
        </span> */}
        {/* <span className="filter-category validity">
          <a id="trigger-PAST" className="nav-trigger f-trigger" data-target=".PAST-EVENT"><i className="nc-icon-mini arrows-2_cross-left" data-view-type="timeline-view"/></a>
          <a id="trigger-ALL" className="nav-trigger f-trigger active" data-target="data-target"><i className="nc-icon-mini design_window-responsive" data-view-type="timeline-view"/></a>
          <a id="trigger-FUTURE" className="nav-trigger f-trigger " data-target=".FUTURE-EVENT"><i className="nc-icon-mini arrows-2_cross-right" data-view-type="timeline-view"/></a>
        </span> */}

        <span className="filter-category">
          <a className="nav-trigger" onClick={(e) => this.handleButton(e, (p) => this.props.viewSwitcher("grid"))}><i className="nc-icon-mini ui-2_grid-square"/></a>
          <a className="nav-trigger" onClick={(e) => this.handleButton(e, (p) => this.props.viewSwitcher("timeline"))}><i className="nc-icon-mini ui-2_menu-35"/></a>
        </span>
      </nav>

    </header>)
  }
}

export default Navigation;
