<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Get parameters
    String inputType = request.getParameter("type");
    String inputId = request.getParameter("id");
    String inputName = request.getParameter("name");
    String inputLabel = request.getParameter("label");
    String inputIcon = request.getParameter("icon");
    String inputPlaceholder = request.getParameter("placeholder");
    String inputValue = request.getParameter("value");
    String inputClass = request.getParameter("class");
    String inputRequired = request.getParameter("required");
    String inputReadonly = request.getParameter("readonly");
    String inputDisabled = request.getParameter("disabled");
    String inputMin = request.getParameter("min");
    String inputMax = request.getParameter("max");
    String inputStep = request.getParameter("step");
    String inputPattern = request.getParameter("pattern");
    String inputHelperText = request.getParameter("helperText");
    String inputErrorText = request.getParameter("errorText");
    String inputRows = request.getParameter("rows");
    String inputAccept = request.getParameter("accept");
    String inputAutocomplete = request.getParameter("autocomplete");
    String inputPrepend = request.getParameter("prepend");
    String inputAppend = request.getParameter("append");
    String inputOptions = request.getParameter("options"); // For select - comma separated
    
    // Default values
    if (inputType == null || inputType.trim().isEmpty()) {
        inputType = "text";
    }
    if (inputName == null || inputName.trim().isEmpty()) {
        inputName = inputId;
    }
    if (inputClass == null) {
        inputClass = "";
    }
    if (inputPlaceholder == null) {
        inputPlaceholder = "";
    }
    if (inputValue == null) {
        inputValue = "";
    }
    
    boolean isRequired = "true".equalsIgnoreCase(inputRequired);
    boolean isReadonly = "true".equalsIgnoreCase(inputReadonly);
    boolean isDisabled = "true".equalsIgnoreCase(inputDisabled);
    boolean hasInputGroup = (inputPrepend != null && !inputPrepend.trim().isEmpty()) || 
                            (inputAppend != null && !inputAppend.trim().isEmpty());
%>

<div class="<%= inputClass %>">
    <% if (inputLabel != null && !inputLabel.trim().isEmpty()) { %>
    <label for="<%= inputId %>" class="form-label">
        <% if (inputIcon != null && !inputIcon.trim().isEmpty()) { %>
        <i class="bi bi-<%= inputIcon %>"></i> 
        <% } %>
        <%= inputLabel %>
        <% if (isRequired) { %>
        <span class="required-star">*</span>
        <% } %>
    </label>
    <% } %>
    
    <% if (hasInputGroup) { %>
    <div class="input-group">
        <% if (inputPrepend != null && !inputPrepend.trim().isEmpty()) { %>
        <span class="input-group-text"><%= inputPrepend %></span>
        <% } %>
    <% } %>
    
    <% if ("textarea".equalsIgnoreCase(inputType)) { %>
        <textarea 
            class="form-control" 
            id="<%= inputId %>" 
            name="<%= inputName %>"
            placeholder="<%= inputPlaceholder %>"
            <%= isRequired ? "required" : "" %>
            <%= isReadonly ? "readonly" : "" %>
            <%= isDisabled ? "disabled" : "" %>
            <%= inputRows != null ? "rows=\"" + inputRows + "\"" : "rows=\"3\"" %>
        ><%= inputValue %></textarea>
    <% } else if ("select".equalsIgnoreCase(inputType)) { %>
        <select 
            class="form-select" 
            id="<%= inputId %>" 
            name="<%= inputName %>"
            <%= isRequired ? "required" : "" %>
            <%= isDisabled ? "disabled" : "" %>
        >
            <option value=""><%= inputPlaceholder.isEmpty() ? "Select an option" : inputPlaceholder %></option>
            <% if (inputOptions != null && !inputOptions.trim().isEmpty()) {
                String[] options = inputOptions.split(",");
                for (String option : options) {
                    String[] optionParts = option.split("\\|");
                    String optionValue = optionParts[0].trim();
                    String optionText = optionParts.length > 1 ? optionParts[1].trim() : optionParts[0].trim();
                    boolean isSelected = optionValue.equals(inputValue);
            %>
            <option value="<%= optionValue %>" <%= isSelected ? "selected" : "" %>><%= optionText %></option>
            <% 
                }
            } %>
        </select>
    <% } else { %>
        <input 
            type="<%= inputType %>" 
            class="form-control" 
            id="<%= inputId %>" 
            name="<%= inputName %>"
            placeholder="<%= inputPlaceholder %>"
            value="<%= inputValue %>"
            <%= isRequired ? "required" : "" %>
            <%= isReadonly ? "readonly" : "" %>
            <%= isDisabled ? "disabled" : "" %>
            <%= inputMin != null ? "min=\"" + inputMin + "\"" : "" %>
            <%= inputMax != null ? "max=\"" + inputMax + "\"" : "" %>
            <%= inputStep != null ? "step=\"" + inputStep + "\"" : "" %>
            <%= inputPattern != null ? "pattern=\"" + inputPattern + "\"" : "" %>
            <%= inputAccept != null ? "accept=\"" + inputAccept + "\"" : "" %>
            <%= inputAutocomplete != null ? "autocomplete=\"" + inputAutocomplete + "\"" : "" %>
        >
    <% } %>
    
    <% if (hasInputGroup) { %>
        <% if (inputAppend != null && !inputAppend.trim().isEmpty()) { %>
        <span class="input-group-text"><%= inputAppend %></span>
        <% } %>
    </div>
    <% } %>
    
    <% if (inputHelperText != null && !inputHelperText.trim().isEmpty()) { %>
    <small class="text-muted"><%= inputHelperText %></small>
    <% } %>
    
    <% if (inputErrorText != null && !inputErrorText.trim().isEmpty()) { %>
    <div class="invalid-feedback"><%= inputErrorText %></div>
    <% } %>
</div>
