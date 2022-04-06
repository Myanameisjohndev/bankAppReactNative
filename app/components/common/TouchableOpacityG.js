import React from 'react';
import {
    Animated,
    Easing,
    Platform,
    Touchable,
    TouchableWithoutFeedback,
    NativeMethodsMixin,
} from 'react-native';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import invariant from 'invariant';
import Svg, {
    G,
} from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

const ensurePositiveDelayProps = function(props: any) {
    invariant(
        !(
            props.delayPressIn < 0 ||
            props.delayPressOut < 0 ||
            props.delayLongPress < 0
        ),
        'Touchable components cannot have negative delay properties'
    );
};

function flattenStyle(style) {
    if (style === null || typeof style !== 'object') {
        return undefined;
    }

    if (!Array.isArray(style)) {
        return style;
    }

    const result = {};
    for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
        const computedStyle = flattenStyle(style[i]);
        if (computedStyle) {
            for (const key in computedStyle) {
                result[key] = computedStyle[key];
            }
        }
    }
    return result;
}

const PRESS_RETENTION_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 *
 * Opacity is controlled by wrapping the children in an Animated.G, which is
 * added to the view hiearchy.  Be aware that this can affect layout.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableOpacity onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('./myButton.png')}
 *       />
 *     </TouchableOpacity>
 *   );
 * },
 * ```
 * ### Example
 *
 * ```ReactNativeWebPlayer
 * import React from "react";
 * import {
 *   AppRegistry,
 * } from 'react-native'
 * import Svg, {
 *     Rect,
 * } from "react-native-svg";
 *
 * import TouchableOpacityG from './TouchableOpacityG';
 *
 * const App = () => (
 *     <Svg width="200" height="200" viewBox="0 0 100 100">
 *         <Rect
 *             x="0"
 *             y="0"
 *             width="100"
 *             height="50"
 *             fill="red"
 *             onPress={e => {
 *                 console.log('press1', e);
 *             }}
 *         />
 *         <TouchableOpacityG
 *             onPress={e => {
 *                 console.log('press2', e);
 *             }}>
 *             <Rect x="0" y="50" width="100" height="50" fill="blue" />
 *         </TouchableOpacityG>
 *     </Svg>
 * );
 *
 * AppRegistry.registerComponent('App', () => App)
 * ```
 *
 */
const TouchableOpacityG = ((createReactClass({
    displayName: 'TouchableOpacityG',
    mixins: [Touchable.Mixin.withoutDefaultFocusAndBlur, NativeMethodsMixin],

    propTypes: {
        /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
         * error found when Flow v0.89 was deployed. To see the error, delete this
         * comment and run Flow. */
        ...TouchableWithoutFeedback.propTypes,
        /**
         * Determines what the opacity of the wrapped view should be when touch is
         * active. Defaults to 0.2.
         */
        activeOpacity: PropTypes.number,
        /**
         * TV preferred focus (see documentation for the View component).
         */
        hasTVPreferredFocus: PropTypes.bool,
        /**
         * Apple TV parallax effects
         */
        tvParallaxProperties: PropTypes.object,
    },

    getDefaultProps: function() {
        return {
            activeOpacity: 0.2,
        };
    },

    getInitialState: function() {
        return {
            /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
             * error found when Flow v0.89 was deployed. To see the error, delete
             * this comment and run Flow. */
            //...this.touchableGetInitialState(),
            /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
             * error found when Flow v0.89 was deployed. To see the error, delete
             * this comment and run Flow. */
            anim: new Animated.Value(this._getChildStyleOpacityWithDefault()),
        };
    },

    componentDidMount: function() {
        ensurePositiveDelayProps(this.props);
    },

    UNSAFE_componentWillReceiveProps: function(nextProps) {
        ensurePositiveDelayProps(nextProps);
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.props.disabled !== prevProps.disabled) {
            this._opacityInactive(250);
        }
    },

    /**
     * Animate the touchable to a new opacity.
     */
    setOpacityTo: function(value: number, duration: number) {
        console.log('setOpacityTo', value, duration);
        Animated.timing(this.state.anim, {
            toValue: value,
            duration: duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
        }).start();
    },

    /**
     * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
     * defined on your component.
     */
    touchableHandleActivePressIn: function(e: PressEvent) {
        if (e.dispatchConfig.registrationName === 'onResponderGrant') {
            this._opacityActive(0);
        } else {
            this._opacityActive(150);
        }
        this.props.onPressIn && this.props.onPressIn(e);
    },

    touchableHandleActivePressOut: function(e: PressEvent) {
        this._opacityInactive(250);
        this.props.onPressOut && this.props.onPressOut(e);
    },

    touchableHandleFocus: function(e: Event) {
        if (Platform.isTV) {
            this._opacityActive(150);
        }
        this.props.onFocus && this.props.onFocus(e);
    },

    touchableHandleBlur: function(e: Event) {
        if (Platform.isTV) {
            this._opacityInactive(250);
        }
        this.props.onBlur && this.props.onBlur(e);
    },

    touchableHandlePress: function(e: PressEvent) {
        this.props.onPress && this.props.onPress(e);
    },

    touchableHandleLongPress: function(e: PressEvent) {
        this.props.onLongPress && this.props.onLongPress(e);
    },

    touchableGetPressRectOffset: function() {
        return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
    },

    touchableGetHitSlop: function() {
        return this.props.hitSlop;
    },

    touchableGetHighlightDelayMS: function() {
        return this.props.delayPressIn || 0;
    },

    touchableGetLongPressDelayMS: function() {
        return this.props.delayLongPress === 0
            ? 0
            : this.props.delayLongPress || 500;
    },

    touchableGetPressOutDelayMS: function() {
        return this.props.delayPressOut;
    },

    _opacityActive: function(duration: number) {
        console.log('_opacityActive', duration);
        this.setOpacityTo(this.props.activeOpacity, duration);
    },

    _opacityInactive: function(duration: number) {
        console.log('_opacityInactive', duration);
        /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
         * error found when Flow v0.89 was deployed. To see the error, delete this
         * comment and run Flow. */
        this.setOpacityTo(this._getChildStyleOpacityWithDefault(), duration);
    },

    _getChildStyleOpacityWithDefault: function() {
        const childStyle = flattenStyle(this.props.style) || {};
        return childStyle.opacity == null ? 1 : childStyle.opacity;
    },

    render: function() {
        return (
            <AnimatedG
                accessible={this.props.accessible !== false}
                accessibilityLabel={this.props.accessibilityLabel}
                accessibilityHint={this.props.accessibilityHint}
                accessibilityRole={this.props.accessibilityRole}
                accessibilityStates={this.props.accessibilityStates}
                opacity={this.state.anim}
                nativeID={this.props.nativeID}
                testID={this.props.testID}
                onLayout={this.props.onLayout}
                isTVSelectable={true}
                hasTVPreferredFocus={this.props.hasTVPreferredFocus}
                tvParallaxProperties={this.props.tvParallaxProperties}
                hitSlop={this.props.hitSlop}
                /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
                 * error found when Flow v0.89 was deployed. To see the error, delete
                 * this comment and run Flow. */
                onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
                onResponderTerminationRequest={
                    /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses
                     * an error found when Flow v0.89 was deployed. To see the error,
                     * delete this comment and run Flow. */
                    this.touchableHandleResponderTerminationRequest
                }
                /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
                 * error found when Flow v0.89 was deployed. To see the error, delete
                 * this comment and run Flow. */
                onResponderGrant={this.touchableHandleResponderGrant}
                /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
                 * error found when Flow v0.89 was deployed. To see the error, delete
                 * this comment and run Flow. */
                onResponderMove={this.touchableHandleResponderMove}
                /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
                 * error found when Flow v0.89 was deployed. To see the error, delete
                 * this comment and run Flow. */
                onResponderRelease={this.touchableHandleResponderRelease}
                /* $FlowFixMe(>=0.89.0 site=react_native_fb) This comment suppresses an
                 * error found when Flow v0.89 was deployed. To see the error, delete
                 * this comment and run Flow. */
                onResponderTerminate={this.touchableHandleResponderTerminate}
                onPress={this.touchableHandlePress}
                onPressIn={this.touchableHandleActivePressIn}
                onPressOut={this.touchableHandleActivePressOut}>
                {this.props.children}
            </AnimatedG>
        );
    },
}): any): React.ComponentType<Props>);

module.exports = TouchableOpacityG;