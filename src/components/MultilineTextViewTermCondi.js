import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

const MultilineTextViewTermCondi = ({children}) => {
  const [contentOffset, setContentOffset] = useState({x: 0, y: 0});
  const [scrollElementHeightPercent, setScrollElementHeightPercent] =
    useState(100);
  const [contentSize, setContentSize] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const scrollPerc =
    (contentOffset.y / (contentSize - scrollViewHeight)) *
    (100 - scrollElementHeightPercent);

  const updateScrollBar = () => {
    const heightPercent = (scrollViewHeight / contentSize) * 100;
    setScrollElementHeightPercent(heightPercent > 100 ? 100 : heightPercent);
  };

  useEffect(() => {
    updateScrollBar();
  }, [scrollViewHeight, contentSize]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scrollView}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingRight: 8,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={e => {
          setContentOffset(e.nativeEvent.contentOffset);
        }}
        onLayout={e => {
          setScrollViewHeight(e.nativeEvent.layout.height);
        }}
        onContentSizeChange={(_, height) => {
          setContentSize(height);
        }}>
        {children}
      </ScrollView>
      <View style={styles.indicatorWrapper}>
        <View style={{flex: 1, width: '100%', marginVertical: 0}}>
          <View
            style={styles.indicator(scrollPerc, scrollElementHeightPercent)}
          />
        </View>
      </View>
    </View>
  );
};

export default MultilineTextViewTermCondi;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  indicatorWrapper: {
    width: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  indicator: (deltaTop, heightPercent) => ({
    width: 4,
    backgroundColor: '#CAB6FF',
    position: 'absolute',
    top: `${Number(deltaTop || 0).toFixed(0)}%`,
    left: 8,
    height: `${heightPercent}%`,
    borderRadius: 2,
  }),
});
