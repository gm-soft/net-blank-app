﻿using System;

namespace Utils.MathHelpers
{
    public class Round
    {
        private readonly double _source;

        private readonly int _digits;

        private readonly MidpointRounding _midpoint;

        public Round(double source, int digits = 2, MidpointRounding midpoint = MidpointRounding.AwayFromZero)
        {
            _source = source;
            _digits = digits;
            _midpoint = midpoint;
        }

        public double Value()
        {
            return System.Math.Round(
                value: _source,
                digits: _digits,
                mode: _midpoint);
        }
    }
}