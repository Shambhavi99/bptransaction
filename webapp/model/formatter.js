sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
    "use strict";
  
    return {
      numberFormat: function (count) {
        // Create a NumberFormat instance for Indian English
        const formatter = NumberFormat.getIntegerInstance({
          style: "decimal",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
          groupingEnabled: true,
          groupingSeparator: ",",
          decimalSeparator: ".",
        });
        return formatter.format(Number(count));
      },
    };
  });
  