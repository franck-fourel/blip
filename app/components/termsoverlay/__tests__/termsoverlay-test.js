/**
 * Copyright (c) 2015, Tidepool Project
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
 */

/*global describe, it, jest, expect */

jest.dontMock('../termsoverlay');

var React = require('react/addons');
var TermsOverlay = require('../termsoverlay').TermsOverlay;
var AGES = require('../termsoverlay').AGES;
var TestUtils = React.addons.TestUtils;

/*
TOU = Terms of Use
PP = Privacy Policy

Final URLs will be: TOU: http://developer.tidepool.io/privacy-policy/
PP: http://developer.tidepool.io/terms-of-use/

Prior to showing TOU and PP, present a
Before you can sign up for Blip, we need to know how old you are:

[ ] I am 18 years old or older. (default selection)
[ ] I am between 13 and 17 years old. You'll need to have a parent or guardian agree to the terms on the next screen.
[ ] I am 12 years old or younger.

[ CONTINUE ]

Store the state of this selection for the user.

== For under 12 login flow. ==
Display: "We are really sorry, but you need to be 13 or older in order to create an account and use Tidepool's Applications."

== For 18 and over login flow: ==
Present TOU and PP in separate scrollable windows. Can be side by side or top/bottom or one followed by the next: Present one checkbox and text.
[ ] "I am 18 or older and I accept the terms of the Tidepool Applications Terms of Use and Privacy Policy".
Do not enable [I ACCEPT] button until the checkbox is selected.

== For 13 - 17 login flow: ==
Present TOU and PP in separate scrollable windows (as above).
Present TWO checkboxes: [ ] "I am 18 or older and I accept the terms of the Tidepool Applications Terms of Use and Privacy Policy".
[ ] "I to my child aged 13 through 17 using Tidepool Applications and agree that they are also bound to the terms of the Tidepool Applications Terms of Use and Privacy Policy".

Do not enable [I ACCEPT] button until BOTH checkboxes are selected.
*/

var metricsCallMock = jest.genMockFunction();

describe('termsoverlay', function() {
  it('is not agreed by default', function() {
    var terms = TestUtils.renderIntoDocument(
      <TermsOverlay trackMetric={metricsCallMock}/>
    );
    expect(terms.state.agreed).toEqual(false);
  });
  it('is not checked by default', function() {
    var terms = TestUtils.renderIntoDocument(
      <TermsOverlay trackMetric={metricsCallMock} />
    );
    expect(terms.state.isChecked).toEqual(false);
  });
  it('age is not confirmed by default', function() {
    var terms = TestUtils.renderIntoDocument(
      <TermsOverlay trackMetric={metricsCallMock} />
    );
    expect(terms.state.ageConfirmed).toEqual(false);
  });
  it('age is over 18 by default', function() {
    var terms = TestUtils.renderIntoDocument(
      <TermsOverlay trackMetric={metricsCallMock} />
    );
    expect(terms.state.ageSelected).toEqual(AGES.OVER_EIGHTEEN.value);
  });
  it('shows age confirmation form by defaut', function() {
    var terms = TestUtils.renderIntoDocument(
      <TermsOverlay trackMetric={metricsCallMock} />
    );

    var age = TestUtils.findRenderedDOMComponentWithClass(terms, 'terms-overlay-age-form');
    expect(age).not.toBeNull();
  });
  describe('age confirmation', function() {
    it('is true once button pressed ', function() {
      var terms = TestUtils.renderIntoDocument(
        <TermsOverlay trackMetric={metricsCallMock} />
      );

      var ageBtn = TestUtils.findRenderedDOMComponentWithTag(terms, 'button');
      expect(ageBtn).not.toBeNull();

      React.addons.TestUtils.Simulate.click(ageBtn);
      expect(terms.state.ageConfirmed).toEqual(true);
    });
    it('shows iframes once button pressed ', function() {
      var terms = TestUtils.renderIntoDocument(
        <TermsOverlay trackMetric={metricsCallMock} />
      );

      var ageBtn = TestUtils.findRenderedDOMComponentWithTag(terms, 'button');
      React.addons.TestUtils.Simulate.click(ageBtn);

      var iframes = TestUtils.scryRenderedDOMComponentsWithClass(terms, 'terms-overlay-iframe');
      expect(iframes).not.toBeNull();
      expect(iframes.length).toEqual(2);
    });
    describe('flow for 18 and over login', function() {
      /*
        == For 18 and over login flow: ==
        Present TOU and PP in separate scrollable windows. Can be side by side or top/bottom or one followed by the next:
        Present one checkbox and text.
        [ ] "I am 18 or older and I accept the terms of the Tidepool Applications Terms of Use and Privacy Policy".
        Do not enable [I ACCEPT] button until the checkbox is selected.
      */
      it('shows TOU and PP', function() {
        var terms = TestUtils.renderIntoDocument(
          <TermsOverlay trackMetric={metricsCallMock} />
        );
        var overEighteen = TestUtils.scryRenderedDOMComponentsWithTag(terms,'input')[0];
        expect(overEighteen.props.value).toEqual(AGES.OVER_EIGHTEEN.value);
        //continue
        var ageBtn = TestUtils.findRenderedDOMComponentWithTag(terms, 'button');
        React.addons.TestUtils.Simulate.click(ageBtn);
        //age confirmation is now true
        expect(terms.state.ageConfirmed).toEqual(true);
        //iframes shown with TOU and PP
        var iframes = TestUtils.scryRenderedDOMComponentsWithClass(terms, 'terms-overlay-iframe');
        expect(iframes).not.toBeNull();
        expect(iframes.length).toEqual(2);
        var termsDetails = iframes[0];
        expect(termsDetails.props.src).toEqual('http://developer.tidepool.io/terms-of-use');
        var privacyDetails = iframes[1];
        expect(privacyDetails.props.src).toEqual('http://developer.tidepool.io/privacy-policy');

        expect(terms.state.isChecked).toEqual(false);
        expect(terms.state.agreed).toEqual(false);
      });
    });
    describe('flow for between 13 and 17 years old', function() {
      /*
        == For 13 - 17 login flow: ==
        Present TOU and PP in separate scrollable windows (as above).
        Present TWO checkboxes:
          [ ] "I am 18 or older and I accept the terms of the Tidepool Applications Terms of Use and Privacy Policy".
          [ ] "I to my child aged 13 through 17 using Tidepool Applications and agree that they are also bound to the terms of the Tidepool Applications Terms of Use and Privacy Policy".
      */
      it('shows TOU and PP and asks for parental consent also', function() {
        var terms = TestUtils.renderIntoDocument(
          <TermsOverlay trackMetric={metricsCallMock} />
        );

        var thirteenToSeventeenOpt = TestUtils.scryRenderedDOMComponentsWithTag(terms,'input')[1];
        expect(thirteenToSeventeenOpt.props.value).toEqual(AGES.THIRTEEN_TO_SEVENTEEN.value);
        React.addons.TestUtils.Simulate.click(thirteenToSeventeenOpt);
        //Continue
        var ageBtn = TestUtils.findRenderedDOMComponentWithTag(terms, 'button');
        React.addons.TestUtils.Simulate.click(ageBtn);
        //age confirmation is now true
        expect(terms.state.ageConfirmed).toEqual(true);
        //TOU and PP shown
        var iframes = TestUtils.scryRenderedDOMComponentsWithClass(terms, 'terms-overlay-iframe');
        expect(iframes).not.toBeNull();
        expect(iframes.length).toEqual(2);
        var termsDetails = iframes[0];
        expect(termsDetails.props.src).toEqual('http://developer.tidepool.io/terms-of-use');
        var privacyDetails = iframes[1];
        expect(privacyDetails.props.src).toEqual('http://developer.tidepool.io/privacy-policy');
        //not yet accpeted
        expect(terms.state.isChecked).toEqual(false);
        expect(terms.state.agreed).toEqual(false);
      });
      it('allows confirmation once both checkboxes selected', function() {
        var terms = TestUtils.renderIntoDocument(
          <TermsOverlay trackMetric={metricsCallMock} />
        );
        //Select between 13 and 17
        var thirteenToSeventeenOpt = TestUtils.scryRenderedDOMComponentsWithTag(terms,'input')[1];
        React.addons.TestUtils.Simulate.change(thirteenToSeventeenOpt);
        //Select Continue
        var ageBtn = TestUtils.findRenderedDOMComponentWithTag(terms, 'button');
        React.addons.TestUtils.Simulate.click(ageBtn);
        //age confirmation is now true
        expect(terms.state.ageConfirmed).toEqual(true);
        //Check both confirmation boxes
        expect(terms.state.isChecked).toEqual(false);
        expect(terms.state.agreed).toEqual(false);
      });
    });
    describe('flow for under 12 login flow', function() {
      /*
        == For under 12 login flow. ==
        Display: "We are really sorry, but you need to be 13 or older in order to create an account and use Tidepool's Applications."
      */
      it('display sorry message', function() {
        var terms = TestUtils.renderIntoDocument(
          <TermsOverlay trackMetric={metricsCallMock} />
        );

        // I am 12 years old or younger.
        var underTwelveOpt = TestUtils.scryRenderedDOMComponentsWithTag(terms,'input')[2];
        React.addons.TestUtils.Simulate.change(underTwelveOpt);
        expect(underTwelveOpt.props.value).toEqual(AGES.TWELVE_OR_UNDER.value);
        //Continue
        var ageBtn = TestUtils.findRenderedDOMComponentWithTag(terms, 'button');
        React.addons.TestUtils.Simulate.click(ageBtn);
        //age confirmation is now true
        expect(terms.state.ageConfirmed).toEqual(true);
        //not yet accepted
        expect(terms.state.isChecked).toEqual(false);
        expect(terms.state.agreed).toEqual(false);
        //No TOU and PP shown
        var iframes = TestUtils.scryRenderedDOMComponentsWithClass(terms, 'terms-overlay-iframe');
        expect(iframes).toEqual([]);
        //Sorry Message shown
        var sorryMsg = TestUtils.findRenderedDOMComponentWithClass(terms, 'terms-overlay-sorry-message');
        expect(sorryMsg).not.toBeNull();
        //still not accepted
        expect(terms.state.isChecked).toEqual(false);
        expect(terms.state.agreed).toEqual(false);
      });
    });
  });
});