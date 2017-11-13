/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

/* global chai */
/* global describe */
/* global it */
/* global beforeEach */
/* global sinon */

var expect = chai.expect;

import React from 'react';
import _ from 'lodash';
import Basics from '../../../../app/components/chart/basics';
import { mount, shallow } from 'enzyme';
import { MGDL_UNITS } from '../../../../app/core/constants';

describe('Basics', () => {
  let baseProps = {
    bgPrefs: {
      bgClasses: {
        'very-low': {
          boundary: 60
        },
        'low': {
          boundary: 80
        },
        'target': {
          boundary: 180
        },
        'high': {
          boundary: 200
        },
        'very-high': {
          boundary: 300
        }
      },
      bgUnits: MGDL_UNITS
    },
    patientData: {
      basicsData: {
        data: {},
      },
    },
    pdf: {},
    onSwitchToPrint: sinon.stub(),
  };

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Basics {...baseProps} />);
  })

  describe('render', function() {
    it('should render the missing data text if no data has been uploaded', function () {
      const noDataMessage = wrapper.find('.patient-data-message');
      const chart = wrapper.find('BasicsChart');
      expect(noDataMessage.length).to.equal(1);
      expect(chart.length).to.equal(0);
      expect(noDataMessage.text()).to.include('upload some device data');
    });

    it('should render the basics chart if any data is uploaded', function () {
      wrapper.setProps({
        patientData: {
          basicsData: _.assign({}, baseProps.patientData.basicsData, {
            data: {
              smbg: {
                data: [
                  { type: 'smbg' }
                ],
              },
            },
            days: [{
              type: 'mostRecent',
            }],
          }),
        }
      });
      const noDataMessage = wrapper.find('.patient-data-message');
      const chart = wrapper.find('BasicsChart');
      expect(noDataMessage.length).to.equal(0);
      expect(chart.length).to.equal(1);
    });

    it('should have a disabled print button and spinner when a pdf is not ready to print', function () {
      let mountedWrapper = mount(<Basics {...baseProps} />);

      var printLink = mountedWrapper.find('.printview-print-icon');
      expect(printLink.length).to.equal(1);
      expect(printLink.hasClass('patient-data-subnav-disabled')).to.be.true;

      var spinner = mountedWrapper.find('.print-loading-spinner');
      expect(spinner.length).to.equal(1);
    });

    it('should have an enabled print button and icon when a pdf is ready and call onSwitchToPrint when clicked', function () {
      var props = _.assign({}, baseProps, {
        pdf: {
          url: 'blobURL',
        },
      });

      let mountedWrapper = mount(<Basics {...props} />);

      var printLink = mountedWrapper.find('.printview-print-icon');
      expect(printLink.length).to.equal(1);
      expect(printLink.hasClass('patient-data-subnav-disabled')).to.be.false;

      var spinner = mountedWrapper.find('.print-loading-spinner');
      expect(spinner.length).to.equal(0);

      expect(props.onSwitchToPrint.callCount).to.equal(0);
      printLink.simulate('click');
      expect(props.onSwitchToPrint.callCount).to.equal(1);
    });
  });
});
